import { ExitToApp, Home, Close } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import throttle from 'lodash/throttle';
import { useEffect, useRef, useState, type FC } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Loader } from '../../../shared/ui/Loader';
import { useAuth } from '../../auth/model/useAuth';
import { useSession } from '../model/store';
import { useConnectionStore } from '../model/useConnectionStore';
import SessionMenu from './SessionMenu';
import SessionsExitModal from './SessionsExitModal';
import { LoaderSmall } from '../../../shared/ui/LoaderSmall';

export const SessionContainer: FC = () => {
  const { sessionId } = useParams<{ sessionId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const sessionConnect = useSession();

  // 1. Створюємо унікальний тимчасовий ключ тільки один раз при монтуванні
  const [localTempId] = useState(() => `pending_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);

  // 2. Якщо sessionId є в URL - беремо його, якщо ні - використовуємо тимчасовий ключ
  const isNewSession = !sessionId;
  const activeConnectionKey = sessionId || localTempId;

  const [isExitOpen, setIsExitOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { connections, connectToSession, sendInteraction, disconnectFromSession } = useConnectionStore();
  const currentConnection = connections[activeConnectionKey];

  useEffect(() => {
    if (!user?.id) return;

    if (isNewSession && !sessionConnect.auctionId) {
      console.warn('Немає даних для створення сесії.');
      navigate('/');
      return;
    }

    // Відправляємо активний ключ. Якщо це нова сесія, стор відправить колбек з реальним ID
    connectToSession(
      activeConnectionKey,
      user.id,
      sessionConnect,
      isNewSession,
      (realSessionId) => {
        // Як тільки бекенд повернув реальний ID, непомітно оновлюємо URL
        navigate(`/session/${realSessionId}`, { replace: true });
      }
    );

  }, [user?.id, activeConnectionKey, sessionConnect, isNewSession, connectToSession, navigate]);

  useEffect(() => {
    if (videoRef.current && currentConnection?.stream) {
      if (videoRef.current.srcObject !== currentConnection.stream) {
        videoRef.current.srcObject = currentConnection.stream;
        videoRef.current.play().catch((err) => {
          console.warn('Автоплей заблоковано браузером:', err);
        });
      }
    }
  }, [currentConnection?.stream]);

  const interact = (action: object) => {
    if (activeConnectionKey) {
      sendInteraction(activeConnectionKey, action);
    }
  };

  const getCoordinates = (e: React.MouseEvent | React.WheelEvent) => {
    const rect = videoRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  };

  const throttledMouseMoveRef = useRef<ReturnType<typeof throttle> | null>(null);
  const throttledWheelRef = useRef<ReturnType<typeof throttle> | null>(null);

  useEffect(() => {
    throttledMouseMoveRef.current = throttle((coords: { x: number; y: number }) => {
      interact({ type: 'mousemove', ...coords });
    }, 50);

    throttledWheelRef.current = throttle((delta: { deltaX: number; deltaY: number }) => {
      interact({ type: 'wheel', ...delta });
    }, 50);

    return () => {
      throttledMouseMoveRef.current?.cancel();
      throttledWheelRef.current?.cancel();
    };
  }, [activeConnectionKey]);

  const handleMouseMove = (e: React.MouseEvent<HTMLVideoElement>) => {
    throttledMouseMoveRef.current?.(getCoordinates(e));
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLVideoElement>) => {
    interact({ type: 'mouseup', ...getCoordinates(e), button: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLVideoElement>) => {
    interact({ type: 'mousedown', ...getCoordinates(e), button: e.button });
    videoRef.current?.focus();
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLVideoElement>) => {
    interact({ type: 'mouseup', ...getCoordinates(e), button: e.button });
  };

  const handleWheel = (e: React.WheelEvent<HTMLVideoElement>) => {
    throttledWheelRef.current?.({ deltaX: e.deltaX, deltaY: e.deltaY });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    interact({ type: 'keydown', key: e.key });
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    interact({ type: 'keyup', key: e.key });
  };

  const disconnectAndExit = () => {
    Object.keys(connections).map((connectionKey) => {
      disconnectFromSession(connectionKey);
    });
    navigate('/');
  };

  const isLoading = currentConnection ? currentConnection.isLoading : true;

  return (
    <div
      className="relative w-full h-full bg-transparent min-h-screen outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
    >

      <SessionMenu>
        <div>
          <IconButton
            onClick={() => setIsExitOpen(true)}
            sx={{
              color: 'red',
              backgroundColor: 'white',
              padding: '5px',
              background: 'none',
              transform: 'rotate(180deg)',
              ':hover': { background: 'none' },
            }}
          >
            <ExitToApp sx={{ width: '20px' }} />
          </IconButton>
        </div>

        {/* --- БЛОК З ВКЛАДКАМИ СЕСІЙ --- */}
        <div className="flex-1 flex items-center gap-2 overflow-x-auto px-4 mx-2">
          {Object.keys(connections).map((connectionKey, index) => {
            const isActive = connectionKey === activeConnectionKey;
            const isPending = connectionKey.startsWith('pending_');

            // Формуємо назву вкладки (можете замінити на назву аукціону, якщо вона є в сторі)
            const tabLabel = isPending
              ? 'Підключення...'
              : `Вкладка ${index + 1}`; // Показуємо перші 4 символи ID

            return (
              <div
                key={connectionKey}
                // Клік по самій вкладці перемикає на цю сесію
                onClick={() => {
                  if (!isPending && !isActive) {
                    navigate(`/session/${connectionKey}`);
                  }
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer transition-colors border select-none ${isActive
                  ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                  : 'bg-white/80 text-gray-700 border-gray-300 hover:bg-white'
                  }`}
              >
                <span className="text-sm font-medium whitespace-nowrap p-2">
                  {tabLabel}
                </span>

                {/* Кнопка закриття конкретної сесії */}
                <div
                  className={`flex items-center justify-center rounded-full p-0.5 transition-colors ${isActive ? 'hover:bg-blue-600' : 'hover:bg-gray-200'
                    }`}
                  onClick={(e) => {
                    e.stopPropagation(); // Зупиняємо клік, щоб не спрацював onClick вкладки
                    disconnectFromSession(connectionKey); // Вбиваємо WebRTC з'єднання

                    // Якщо ми закрили ту вкладку, на якій зараз знаходимось - йдемо на головну
                    if (isActive) {
                      navigate('/');
                    }
                  }}
                >
                  <Close sx={{ width: '16px', height: '16px' }} />
                </div>
              </div>
            );
          })}
        </div>
        {/* --- КІНЕЦЬ БЛОКУ З ВКЛАДКАМИ --- */}

        <IconButton
          component={Link} to="/"
          sx={{
            color: 'text.secondary',
            backgroundColor: 'white',
            padding: '5px',
            background: 'none',
            ':hover': { background: 'none' },
          }}
        >
          <Home sx={{ width: '20px' }} />
        </IconButton>
      </SessionMenu>
      {isLoading && <LoaderSmall />}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        onContextMenu={(e) => e.preventDefault()}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
        className={`w-full h-full object-contain select-none touch-none ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        style={{
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
        }}
      />
      {isExitOpen && (
        <SessionsExitModal
          isModalOpen={isExitOpen}
          handleExit={disconnectAndExit}
          handleClose={() => setIsExitOpen(false)}
        />
      )}
    </div>
  );
};