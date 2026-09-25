import { Box } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTabsStore } from '../model/tabs';
import SessionTabsBar from './SessionTabsBar';
import SessionView from './SessionView';

// Сторінка вкладки: /session/:accountId. Вкладка відкривається з аукціону, «Обраного» або відновлюється після входу.
export const SessionContainer = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const tab = useTabsStore((s) => (accountId ? s.tabs[accountId] : undefined));
  const userId = useTabsStore((s) => s.userId);

  useEffect(() => {
    // Вкладки вже відновлено, а такої немає (закрита) - повертаємось до панелі.
    if (userId && !tab) navigate('/auctions', { replace: true });
  }, [userId, tab, navigate]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <SessionTabsBar activeId={accountId} />
      {tab && <SessionView key={tab.auctionAuthId} tab={tab} />}
    </Box>
  );
};
