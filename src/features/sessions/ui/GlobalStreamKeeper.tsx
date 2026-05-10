// import { useEffect, useRef } from 'react';
// import { useConnectionStore } from '../model/useConnectionStore';
// import { useLocation } from 'react-router-dom';

// // Компонент для підтримки одного потоку
// const HiddenVideo = ({ stream }: { stream: MediaStream }) => {
//   const videoRef = useRef<HTMLVideoElement>(null);

//   useEffect(() => {
//     if (videoRef.current && stream) {
//       if (videoRef.current.srcObject !== stream) {
//         videoRef.current.srcObject = stream;
//       }
//       // Обов'язково запускаємо відео, ігноруючи можливі помилки автоплею
//       videoRef.current.play().catch((e) => {
//         console.warn('Приховане відео не змогло запуститись автоматично:', e);
//       });
//     }
//   }, [stream]);

//   return (
//     <video
//       ref={videoRef}
//       autoPlay
//       muted
//       playsInline
//       style={{
//         position: 'absolute',
//         width: '1px',
//         height: '1px',
//         opacity: 0.01,
//         pointerEvents: 'none',
//         zIndex: -9999, // Ховаємо глибоко під усі інтерфейси
//       }}
//     />
//   );
// };

// export const GlobalStreamKeeper = () => {
//   // Підписуємось на всі з'єднання зі стору
//   const connections = useConnectionStore((state) => state.connections);
//   const location = useLocation();

//   return (
//     <div style={{ position: 'fixed', top: 0, left: 0 }}>
//       {Object.entries(connections).map(([key, conn]) => {
//         // Якщо потік ще вантажиться або його немає - нічого не рендеримо
//         if (!conn.stream) return null;

//         if (location.pathname.includes(`/session/${key}`)) {
//           return null;
//         }
//         return <></>
//       })}
//     </div>
//   );
// };