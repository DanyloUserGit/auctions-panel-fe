import { useEffect } from 'react';
import { useWindowSize } from '../../../shared/hooks/useWindowSize';
import { fetchMyTabs } from './api';
import { SESSION_TAB_BAR_HEIGHT, useTabsStore } from './tabs';

// Відновлення вкладок користувача після входу / оновлення сторінки та розмір трансляції під екран.
export function useSessionTabs(userId?: string) {
  const init = useTabsStore((s) => s.init);
  const setViewport = useTabsStore((s) => s.setViewport);
  const { width, height } = useWindowSize();

  useEffect(() => {
    // Браузер у воркері відкривається розміром області трансляції (екран мінус рядок вкладок),
    // щоб відео заповнювало її без порожніх смуг по боках.
    setViewport(width, Math.max(1, height - SESSION_TAB_BAR_HEIGHT));
  }, [width, height, setViewport]);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    fetchMyTabs()
      .catch(() => [])
      .then((serverTabs) => {
        if (!cancelled) init(userId, serverTabs);
      });
    return () => {
      cancelled = true;
    };
  }, [userId, init]);
}
