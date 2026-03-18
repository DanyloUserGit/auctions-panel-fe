import { Close, Language } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { useTabsStore } from '../../features/sessions/model/useTabsStore';

export default function Tabs() {
  const { tabs, activeTabId, setActiveTab, closeTab } = useTabsStore();

  return (
    <Box className="flex items-end bg-[#dee1e6] px-2 pt-2 border-b border-[#ccc] w-full select-none">
      {tabs.map((tab) => {
        const isActive = activeTabId === tab.id;
        return (
          <Box
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              relative flex items-center h-9 min-w-[120px] max-w-[200px] px-3 cursor-default group
              transition-all duration-150 ease-in-out
              ${
                isActive
                  ? 'bg-white rounded-t-lg z-10 shadow-[0_-1px_3px_rgba(0,0,0,0.1)]'
                  : 'hover:bg-[#e8eaed] rounded-t-lg mx-[1px]'
              }
            `}
            sx={{
              '&::before, &::after': isActive
                ? {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    width: '10px',
                    height: '10px',
                    backgroundColor: 'white',
                    zIndex: 1,
                  }
                : {},
              '&::before': isActive
                ? {
                    left: '-10px',
                    mask: 'radial-gradient(circle at 0 0, transparent 10px, black 10px)',
                  }
                : {},
              '&::after': isActive
                ? {
                    right: '-10px',
                    mask: 'radial-gradient(circle at 100% 0, transparent 10px, black 10px)',
                  }
                : {},
            }}
          >
            <Box
              sx={{
                mr: 1.5,
                display: 'flex',
                alignItems: 'center',
                color: 'var(--color-primary)',
                paddingLeft: 1.5,
              }}
            >
              {<Language sx={{ fontSize: 16 }} />}
            </Box>

            {/* Заголовок */}
            <Typography
              variant="caption"
              className={`truncate flex-1 font-medium ${isActive ? 'text-gray-800' : 'text-gray-600'}`}
            >
              {tab.title}
            </Typography>

            {/* Кнопка закриття */}
            <IconButton
              size="small"
              onClick={() => closeTab(tab.id)}
              className={`
                ml-1 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity 
                hover:bg-gray-300 rounded-full
                ${isActive ? 'opacity-100' : ''}
              `}
              sx={{ width: 16, height: 16, paddingRight: 1.5 }}
            >
              <Close sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        );
      })}
    </Box>
  );
}
