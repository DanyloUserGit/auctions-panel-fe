import { ChevronLeft, ChevronRight, Close, Home, Logout } from '@mui/icons-material';
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SESSION_TAB_BAR_HEIGHT, useTabsStore, type SessionTab, type TabStatus } from '../model/tabs';
import SessionsExitModal from './SessionsExitModal';

const STATUS_COLOR: Record<TabStatus, string> = {
  connecting: '#f59e0b',
  ready: '#16a34a',
  error: '#dc2626',
  ended: '#94a3b8',
};

const tabTitle = (tab: SessionTab) => tab.accountTitle || 'Акаунт';

// Рядок вкладок як у браузері (ТЗ 5.2): Home (повернення до панелі без закриття вкладок),
// «+» (відкрити ще один аукціон/акаунт), вкладки в збереженому порядку, «Вийти з усіх сесій».
export default function SessionTabsBar({ activeId }: { activeId?: string }) {
  const navigate = useNavigate();
  const order = useTabsStore((s) => s.order);
  const tabs = useTabsStore((s) => s.tabs);
  const closeTab = useTabsStore((s) => s.closeTab);
  const closeAll = useTabsStore((s) => s.closeAll);
  const moveTab = useTabsStore((s) => s.moveTab);
  const [isExitOpen, setIsExitOpen] = useState(false);

  const handleClose = (id: string) => {
    const index = order.indexOf(id);
    closeTab(id);
    if (id !== activeId) return;
    const next = order[index + 1] ?? order[index - 1];
    navigate(next && next !== id ? `/session/${next}` : '/auctions');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 1,
        py: 0.5,
        borderBottom: '1px solid',
        borderColor: 'grey.300',
        bgcolor: 'grey.50',
        // Фіксована висота: решту екрана займає трансляція (див. SESSION_TAB_BAR_HEIGHT).
        height: SESSION_TAB_BAR_HEIGHT,
        boxSizing: 'border-box',
      }}
    >
      <Tooltip title="До панелі (вкладки лишаються відкритими)">
        <IconButton size="small" onClick={() => navigate('/auctions')}>
          <Home fontSize="small" />
        </IconButton>
      </Tooltip>

      <Box sx={{ display: 'flex', gap: 0.75, overflowX: 'auto', flexGrow: 1, py: 0.25 }}>
        {order.map((id, index) => {
          const tab = tabs[id];
          if (!tab) return null;
          const isActive = id === activeId;
          return (
            <Box
              key={id}
              onClick={() => navigate(`/session/${id}`)}
              title={[tab.auctionTitle, tab.accountTitle].filter(Boolean).join(' · ')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                pl: 1,
                pr: 0.25,
                py: 0.25,
                borderRadius: 1,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: isActive ? 'primary.main' : 'grey.300',
                bgcolor: isActive ? 'primary.main' : 'background.paper',
                color: isActive ? 'primary.contrastText' : 'text.primary',
                whiteSpace: 'nowrap',
                userSelect: 'none',
                flexShrink: 0,
              }}
            >
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: STATUS_COLOR[tab.status], flexShrink: 0 }} />
              <Box sx={{ lineHeight: 1.1, maxWidth: 180, overflow: 'hidden' }}>
                <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                  {tabTitle(tab)}
                </Typography>
                {tab.auctionTitle && (
                  <Typography variant="caption" noWrap sx={{ opacity: 0.8, display: 'block' }}>
                    {tab.auctionTitle}
                  </Typography>
                )}
              </Box>
              {isActive && order.length > 1 && (
                <>
                  <IconButton size="small" color="inherit" disabled={index === 0} onClick={(e) => { e.stopPropagation(); moveTab(id, -1); }}>
                    <ChevronLeft sx={{ fontSize: 16 }} />
                  </IconButton>
                  <IconButton size="small" color="inherit" disabled={index === order.length - 1} onClick={(e) => { e.stopPropagation(); moveTab(id, 1); }}>
                    <ChevronRight sx={{ fontSize: 16 }} />
                  </IconButton>
                </>
              )}
              <Tooltip title="Закрити вкладку">
                <IconButton size="small" color="inherit" onClick={(e) => { e.stopPropagation(); handleClose(id); }}>
                  <Close sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Box>
          );
        })}
      </Box>

      {order.length > 0 && (
        <Button size="small" color="error" startIcon={<Logout />} onClick={() => setIsExitOpen(true)} sx={{ whiteSpace: 'nowrap' }}>
          Вийти з усіх сесій
        </Button>
      )}
      <SessionsExitModal
        isModalOpen={isExitOpen}
        handleClose={() => setIsExitOpen(false)}
        handleExit={() => {
          closeAll();
          navigate('/auctions');
        }}
      />
    </Box>
  );
}
