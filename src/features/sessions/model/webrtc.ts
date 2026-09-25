// ICE-сервери для WebRTC-трансляції. TURN потрібен, коли пряме з'єднання неможливе
// (корпоративні мережі, Firefox «ICE failed, add a TURN server») - ТЗ 20.
// Налаштовується в .env фронтенду без змін коду:
//   VITE_STUN_URLS=stun:stun.example.com:3478           (через кому)
//   VITE_TURN_URLS=turn:turn.example.com:3478?transport=udp,turn:turn.example.com:3478?transport=tcp
//   VITE_TURN_USERNAME=...  VITE_TURN_CREDENTIAL=...
const list = (value?: string) =>
  (value ?? '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);

export function rtcConfiguration(): RTCConfiguration {
  const env = import.meta.env;
  const iceServers: RTCIceServer[] = [];

  const stun = list(env.VITE_STUN_URLS);
  iceServers.push({ urls: stun.length ? stun : ['stun:stun.l.google.com:19302'] });

  const turn = list(env.VITE_TURN_URLS);
  if (turn.length) {
    iceServers.push({ urls: turn, username: env.VITE_TURN_USERNAME, credential: env.VITE_TURN_CREDENTIAL });
  }

  return { iceServers };
}
