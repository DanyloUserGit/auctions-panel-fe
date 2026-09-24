import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Session } from '../model/types';
import { Loader } from '../../../shared/ui/Loader'; // Перевірте правильність шляху до вашого Loader

interface Props {
  sessions: Session[];
}

export default function AutoConnectSession({ sessions }: Props) {
  const navigate = useNavigate();

  useEffect(() => {
    // Шукаємо першу активну сесію
    const activeSession = sessions.find((s) => s.isActive);

    if (activeSession) {
      // Якщо є активна - підключаємось до неї.
      // Використовуємо replace: true, щоб при натисканні "Назад"
      // користувач не потрапляв знову на сторінку нескінченного редиректу.
      navigate(`/session/${activeSession.id}`, { replace: true });
    } else {
      // Якщо активної немає - переходимо на сторінку створення нової
      navigate(`/session`, { replace: true });
    }
  }, [sessions, navigate]);

  // Показуємо лоадер користувачеві на ті мілісекунди, поки відбувається перенаправлення
  return <Loader />;
}