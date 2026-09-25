import { AlarmAdd, ArrowBack, Refresh } from '@mui/icons-material';
import { Alert, Box, Button, IconButton, Tooltip } from '@mui/material';
import throttle from 'lodash/throttle';
import { useEffect, useMemo, useRef, useState, type ClipboardEvent, type KeyboardEvent, type PointerEvent, type WheelEvent } from 'react';
import { LoaderSmall } from '../../../shared/ui/LoaderSmall';
import ReminderDialog from '../../notifications/ui/ReminderDialog';
import { useTabsStore, type SessionTab } from '../model/tabs';

// Зсув пальця, після якого дотик вважається прокруткою, а не натисканням.
const TAP_TOLERANCE = 10;

// Трансляція однієї вкладки та керування нею мишею, клавіатурою й дотиками (ТЗ 7.1).
// Права кнопка миші в трансляцію не передається взагалі; адресного рядка немає.
export default function SessionView({ tab }: { tab: SessionTab }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const touch = useRef<{ x: number; y: number; lastY: number; lastX: number; moved: boolean } | null>(null);
  const sendAction = useTabsStore((s) => s.sendAction);
  const retryTab = useTabsStore((s) => s.retryTab);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const id = tab.auctionAuthId;

  const send = useMemo(() => (action: object) => sendAction(id, action), [sendAction, id]);
  const throttledMove = useMemo(() => throttle((x: number, y: number) => send({ type: 'mousemove', x, y }), 50), [send]);
  const throttledWheel = useMemo(
    () => throttle((deltaX: number, deltaY: number) => send({ type: 'wheel', deltaX, deltaY }), 50),
    [send],
  );
  useEffect(() => () => {
    throttledMove.cancel();
    throttledWheel.cancel();
  }, [throttledMove, throttledWheel]);

  useEffect(() => {
    const video = videoRef.current;
    if (video && tab.stream && video.srcObject !== tab.stream) {
      video.srcObject = tab.stream;
      video.play().catch(() => undefined);
    }
  }, [tab.stream]);

  // Координати відносно реального зображення (object-contain лишає поля по краях).
  const coords = (e: { clientX: number; clientY: number }) => {
    const video = videoRef.current;
    if (!video) return { x: 0, y: 0 };
    const rect = video.getBoundingClientRect();
    const ratio = video.videoWidth && video.videoHeight ? video.videoWidth / video.videoHeight : rect.width / rect.height;
    let width = rect.width;
    let height = rect.height;
    if (rect.width / rect.height > ratio) width = rect.height * ratio;
    else height = rect.width / ratio;
    const left = rect.left + (rect.width - width) / 2;
    const top = rect.top + (rect.height - height) / 2;
    return {
      x: Math.min(1, Math.max(0, (e.clientX - left) / width)),
      y: Math.min(1, Math.max(0, (e.clientY - top) / height)),
    };
  };

  const onPointerDown = (e: PointerEvent<HTMLVideoElement>) => {
    if (e.pointerType === 'touch') {
      touch.current = { x: e.clientX, y: e.clientY, lastX: e.clientX, lastY: e.clientY, moved: false };
      return;
    }
    if (e.button !== 0) return; // права й середня кнопки заблоковані
    e.currentTarget.setPointerCapture(e.pointerId);
    send({ type: 'mousedown', ...coords(e), button: 0 });
  };

  const onPointerMove = (e: PointerEvent<HTMLVideoElement>) => {
    if (e.pointerType === 'touch') {
      const t = touch.current;
      if (!t) return;
      if (Math.abs(e.clientX - t.x) > TAP_TOLERANCE || Math.abs(e.clientY - t.y) > TAP_TOLERANCE) t.moved = true;
      if (t.moved) {
        // Перетягування пальцем прокручує сторінку, як на телефоні.
        throttledWheel((t.lastX - e.clientX) * 2, (t.lastY - e.clientY) * 2);
        t.lastX = e.clientX;
        t.lastY = e.clientY;
      }
      return;
    }
    const { x, y } = coords(e);
    throttledMove(x, y);
  };

  const onPointerUp = (e: PointerEvent<HTMLVideoElement>) => {
    if (e.pointerType === 'touch') {
      const t = touch.current;
      touch.current = null;
      if (t && !t.moved) {
        const point = coords(e);
        send({ type: 'mousedown', ...point, button: 0 });
        send({ type: 'mouseup', ...point, button: 0 });
      }
      return;
    }
    if (e.button !== 0) return;
    send({ type: 'mouseup', ...coords(e), button: 0 });
  };

  const onWheel = (e: WheelEvent<HTMLVideoElement>) => throttledWheel(e.deltaX, e.deltaY);

  const onKey = (type: 'keydown' | 'keyup') => (e: KeyboardEvent<HTMLDivElement>) => {
    // Ctrl/Cmd+V обробляє onPaste: вставляємо текст, а не натискання клавіш.
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') return;
    e.preventDefault();
    send({ type, key: e.key });
  };

  const onPaste = (e: ClipboardEvent<HTMLDivElement>) => {
    const text = e.clipboardData.getData('text');
    if (text) {
      e.preventDefault();
      send({ type: 'text', text });
    }
  };

  const showVideo = tab.status === 'ready' && tab.isStreaming;

  return (
    <Box
      tabIndex={0}
      onKeyDown={onKey('keydown')}
      onKeyUp={onKey('keyup')}
      onPaste={onPaste}
      onContextMenu={(e) => e.preventDefault()}
      sx={{ position: 'relative', flexGrow: 1, minHeight: 0, outline: 'none', display: 'flex', flexDirection: 'column' }}
    >
      {/* Кнопки поверх трансляції, щоб відео займало весь екран. */}
      <Box sx={{ position: 'absolute', top: 4, left: 4, zIndex: 2, display: 'flex', gap: 0.5, bgcolor: 'rgba(255,255,255,0.85)', borderRadius: 1 }}>
        <Tooltip title="Назад (у межах трансляції)">
          <span>
            <IconButton size="small" disabled={tab.status !== 'ready'} onClick={() => send({ type: 'navigate_back' })}>
              <ArrowBack fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Нагадати про завершення аукціону">
          <IconButton size="small" onClick={() => setIsReminderOpen(true)}>
            <AlarmAdd fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {(tab.status === 'connecting' || (tab.status === 'ready' && !tab.isStreaming)) && <LoaderSmall />}

      {(tab.status === 'error' || tab.status === 'ended') && (
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
          <Alert
            severity={tab.status === 'error' ? 'error' : 'info'}
            action={
              <Button color="inherit" size="small" startIcon={<Refresh />} onClick={() => retryTab(id)}>
                Підключитися знову
              </Button>
            }
          >
            {tab.message || (tab.status === 'error' ? 'Помилка підключення до сесії' : 'Сесію завершено')}
          </Alert>
        </Box>
      )}

      {isReminderOpen && (
        <ReminderDialog
          defaultTitle={[tab.auctionTitle, tab.accountTitle].filter(Boolean).join(' · ')}
          onClose={() => setIsReminderOpen(false)}
        />
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (touch.current = null)}
        onWheel={onWheel}
        style={{
          width: '100%',
          flexGrow: 1,
          minHeight: 0,
          objectFit: 'contain',
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
          display: showVideo ? 'block' : 'none',
        }}
      />
    </Box>
  );
}
