import { create } from 'zustand';
import { socket } from '../../../shared/http';
import { rtcConfiguration } from './webrtc';

// Вкладки трансляцій (ТЗ 5.2): одна вкладка на акаунт аукціону, персональні для користувача.
// Сесію обирає сервер; вкладка лише просить підключення до акаунта (join_auction) і отримує
// відповідь за своїм requestId, а сигнали WebRTC і події - за sessionId. Так відповіді однієї
// вкладки ніколи не потрапляють в іншу, навіть коли кілька вкладок підключаються одночасно.

// Висота рядка вкладок над трансляцією, px.
export const SESSION_TAB_BAR_HEIGHT = 44;

export type TabStatus = 'connecting' | 'ready' | 'error' | 'ended';

export interface TabInfo {
  auctionId: string;
  auctionAuthId: string;
  auctionTitle?: string;
  accountTitle?: string;
}

export interface SessionTab extends TabInfo {
  status: TabStatus;
  message?: string;
  sessionId?: string;
  requestId?: string;
  stream: MediaStream | null;
  isStreaming: boolean;
}

type Runtime = {
  pc: RTCPeerConnection | null;
  dataChannel: RTCDataChannel | null;
  pendingCandidates: RTCIceCandidateInit[];
};

interface TabsState {
  userId: string | null;
  order: string[];
  tabs: Record<string, SessionTab>;
  viewport: { width: number; height: number };
  init: (userId: string, serverTabs: TabInfo[]) => void;
  setViewport: (width: number, height: number) => void;
  openTab: (info: TabInfo) => void;
  retryTab: (auctionAuthId: string) => void;
  closeTab: (auctionAuthId: string) => void;
  closeAll: () => void;
  leaveAllOnLogout: () => void;
  moveTab: (auctionAuthId: string, delta: number) => void;
  sendAction: (auctionAuthId: string, action: object) => void;
}

// Не зберігається в стані zustand, бо не серіалізується і не має викликати перерендер.
const runtimes = new Map<string, Runtime>();

const storageKey = (userId: string) => `session-tabs:${userId}`;

type StoredTab = TabInfo;

function readStored(userId: string): StoredTab[] {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return raw ? (JSON.parse(raw) as StoredTab[]) : [];
  } catch {
    return [];
  }
}

function writeStored(state: Pick<TabsState, 'userId' | 'order' | 'tabs'>) {
  if (!state.userId) return;
  try {
    const list: StoredTab[] = state.order
      .map((id) => state.tabs[id])
      .filter(Boolean)
      .map(({ auctionId, auctionAuthId, auctionTitle, accountTitle }) => ({ auctionId, auctionAuthId, auctionTitle, accountTitle }));
    localStorage.setItem(storageKey(state.userId), JSON.stringify(list));
  } catch {
    /* сховище недоступне - порядок просто не збережеться */
  }
}

const newRequestId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

function teardown(auctionAuthId: string) {
  const runtime = runtimes.get(auctionAuthId);
  if (!runtime) return;
  runtime.dataChannel?.close();
  runtime.pc?.getReceivers().forEach((r) => r.track?.stop());
  runtime.pc?.close();
  runtimes.delete(auctionAuthId);
}

export const useTabsStore = create<TabsState>((set, get) => {
  const patch = (auctionAuthId: string, update: Partial<SessionTab>) =>
    set((state) => {
      const tab = state.tabs[auctionAuthId];
      if (!tab) return state;
      return { tabs: { ...state.tabs, [auctionAuthId]: { ...tab, ...update } } };
    });

  const findBy = (predicate: (tab: SessionTab) => boolean) =>
    Object.values(get().tabs).find(predicate);

  const join = (auctionAuthId: string) => {
    const tab = get().tabs[auctionAuthId];
    if (!tab) return;
    teardown(auctionAuthId);
    const requestId = newRequestId();
    patch(auctionAuthId, { status: 'connecting', message: undefined, requestId, stream: null, isStreaming: false });
    if (!socket.connected) {
      socket.connect();
      return; // приєднання відбудеться в обробнику 'connect'
    }
    const { width, height } = get().viewport;
    socket.emit('join_auction', {
      auctionId: tab.auctionId,
      auctionAuthId: tab.auctionAuthId,
      sessionId: tab.sessionId,
      width: width || window.innerWidth,
      height: height || window.innerHeight - SESSION_TAB_BAR_HEIGHT,
      requestId,
    });
  };

  const startWebRtc = async (auctionAuthId: string, sessionId: string) => {
    teardown(auctionAuthId);
    const pc = new RTCPeerConnection(rtcConfiguration());
    const runtime: Runtime = { pc, dataChannel: null, pendingCandidates: [] };
    runtimes.set(auctionAuthId, runtime);

    pc.addTransceiver('video', { direction: 'recvonly' });
    runtime.dataChannel = pc.createDataChannel('interact');

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('webrtc_signal', { sessionId, signalData: { type: 'candidate', candidate: event.candidate } });
      }
    };
    pc.ontrack = (event) => {
      if (runtimes.get(auctionAuthId)?.pc !== pc) return;
      const stream = event.streams?.[0] ?? new MediaStream([event.track]);
      patch(auctionAuthId, { stream });
      event.track.onunmute = () => patch(auctionAuthId, { isStreaming: true });
    };
    pc.onconnectionstatechange = () => {
      if (runtimes.get(auctionAuthId)?.pc !== pc) return;
      if (pc.connectionState === 'failed') {
        patch(auctionAuthId, {
          status: 'error',
          message: 'Не вдалося встановити з’єднання з трансляцією (WebRTC). Перевірте мережу або спробуйте ще раз.',
        });
      }
    };

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    if (runtimes.get(auctionAuthId)?.pc !== pc) return;

    const { width, height } = get().viewport;
    socket.emit('webrtc_signal', {
      sessionId,
      signalData: { type: 'offer', sdp: offer.sdp },
      width: width || window.innerWidth,
      height: height || window.innerHeight - SESSION_TAB_BAR_HEIGHT,
    });
  };

  // Події сокета: реєструються один раз для всіх вкладок
  socket.on('connect', () => {
    // (Пере)підключення сокета: кожна жива вкладка повторно приєднується до своєї сесії.
    Object.values(get().tabs)
      .filter((t) => t.status === 'connecting' || t.status === 'ready')
      .forEach((t) => join(t.auctionAuthId));
  });

  socket.on('session_ready', ({ requestId, sessionId }: { requestId?: string; sessionId: string }) => {
    const tab = findBy((t) => !!requestId && t.requestId === requestId);
    if (!tab) return;
    patch(tab.auctionAuthId, { status: 'ready', sessionId, requestId: undefined });
    startWebRtc(tab.auctionAuthId, sessionId).catch(() =>
      patch(tab.auctionAuthId, { status: 'error', message: 'Не вдалося запустити трансляцію' }),
    );
  });

  socket.on('session_error', ({ requestId, sessionId, message }: { requestId?: string; sessionId?: string; message: string }) => {
    const tab = findBy((t) => (!!requestId && t.requestId === requestId) || (!requestId && !!sessionId && t.sessionId === sessionId));
    if (!tab) return;
    teardown(tab.auctionAuthId);
    patch(tab.auctionAuthId, { status: 'error', message, requestId: undefined, stream: null, isStreaming: false });
  });

  socket.on('session_ended', ({ sessionId, message }: { sessionId: string; message?: string }) => {
    const tab = findBy((t) => t.sessionId === sessionId);
    if (!tab) return;
    teardown(tab.auctionAuthId);
    patch(tab.auctionAuthId, {
      status: 'ended',
      sessionId: undefined,
      message: message || 'Сесію завершено',
      stream: null,
      isStreaming: false,
    });
  });

  type WorkerSignal = { type: 'answer'; sdp: string } | { type: 'candidate'; candidate: RTCIceCandidateInit };
  socket.on('webrtc_signal_from_worker', async ({ sessionId, signal }: { sessionId: string; signal: WorkerSignal }) => {
    const tab = findBy((t) => t.sessionId === sessionId);
    const runtime = tab && runtimes.get(tab.auctionAuthId);
    const pc = runtime?.pc;
    if (!pc || !runtime) return;
    try {
      if (signal.type === 'answer') {
        await pc.setRemoteDescription({ type: 'answer', sdp: signal.sdp });
        for (const candidate of runtime.pendingCandidates.splice(0)) {
          await pc.addIceCandidate(candidate);
        }
      } else if (signal.type === 'candidate' && signal.candidate) {
        if (pc.remoteDescription) await pc.addIceCandidate(signal.candidate);
        else runtime.pendingCandidates.push(signal.candidate);
      }
    } catch (e) {
      console.error('Помилка WebRTC сигналу:', e);
    }
  });

  return {
    userId: null,
    order: [],
    tabs: {},
    viewport: { width: 0, height: 0 },

    // Вхід користувача: вкладки з його збереженого списку (у збереженому порядку) + активні на сервері.
    init: (userId, serverTabs) => {
      if (get().userId === userId) return;
      get().leaveAllOnLogout();

      const stored = readStored(userId);
      const infos = [...stored, ...serverTabs.filter((s) => !stored.some((t) => t.auctionAuthId === s.auctionAuthId))];
      const tabs: Record<string, SessionTab> = {};
      infos.forEach((info) => {
        tabs[info.auctionAuthId] = { ...info, status: 'connecting', stream: null, isStreaming: false };
      });
      set({ userId, order: infos.map((i) => i.auctionAuthId), tabs });
      writeStored(get());
      infos.forEach((info) => join(info.auctionAuthId));
    },

    setViewport: (width, height) => set({ viewport: { width, height } }),

    // Вже відкритий акаунт не створює нову вкладку (ТЗ 5.2); вкладку з помилкою підключаємо знову.
    openTab: (info) => {
      const existing = get().tabs[info.auctionAuthId];
      if (existing) {
        patch(info.auctionAuthId, {
          auctionTitle: info.auctionTitle ?? existing.auctionTitle,
          accountTitle: info.accountTitle ?? existing.accountTitle,
        });
        if (existing.status === 'error' || existing.status === 'ended') get().retryTab(info.auctionAuthId);
        return;
      }
      set((state) => ({
        order: [...state.order, info.auctionAuthId],
        tabs: { ...state.tabs, [info.auctionAuthId]: { ...info, status: 'connecting', stream: null, isStreaming: false } },
      }));
      writeStored(get());
      join(info.auctionAuthId);
    },

    // Повторне підключення вкладки з помилкою або завершеною сесією (сервер сам обере сесію).
    retryTab: (auctionAuthId) => {
      patch(auctionAuthId, { sessionId: undefined });
      join(auctionAuthId);
    },

    // Закриття вкладки від'єднує користувача від сесії (лічильник підключень зменшується).
    closeTab: (auctionAuthId) => {
      const tab = get().tabs[auctionAuthId];
      if (!tab) return;
      teardown(auctionAuthId);
      if (tab.sessionId && socket.connected) socket.emit('leave_auction', { sessionId: tab.sessionId });
      set((state) => {
        const tabs = { ...state.tabs };
        delete tabs[auctionAuthId];
        return { tabs, order: state.order.filter((id) => id !== auctionAuthId) };
      });
      writeStored(get());
    },

    // «Вийти з усіх сесій»: закриває всі вкладки.
    closeAll: () => {
      get().order.forEach((id) => get().closeTab(id));
    },

    // Вихід із системи: від'єднуємось від сесій, але список вкладок лишається для наступного входу.
    leaveAllOnLogout: () => {
      Object.values(get().tabs).forEach((tab) => {
        teardown(tab.auctionAuthId);
        if (tab.sessionId && socket.connected) socket.emit('leave_auction', { sessionId: tab.sessionId });
      });
      set({ userId: null, order: [], tabs: {} });
    },

    moveTab: (auctionAuthId, delta) => {
      const order = [...get().order];
      const index = order.indexOf(auctionAuthId);
      const target = index + delta;
      if (index < 0 || target < 0 || target >= order.length) return;
      [order[index], order[target]] = [order[target], order[index]];
      set({ order });
      writeStored(get());
    },

    sendAction: (auctionAuthId, action) => {
      const channel = runtimes.get(auctionAuthId)?.dataChannel;
      if (channel?.readyState === 'open') channel.send(JSON.stringify(action));
    },
  };
});
