import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TabItem {
  key: string;   
  id: string;    
  title: string;
}

interface TabsState {
  tabs: TabItem[];
  activeTabId: string | null;
  addTab: (tab: TabItem) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTabId: (oldId: string, newId: string, newTitle: string) => void;
}

export const useTabsStore = create<TabsState>()(
  persist(
    (set) => ({
      tabs: [],
      activeTabId: null,

      addTab: (tab) => set((state) => {
        const exists = state.tabs.some(t => t.id === tab.id);
        if (exists) return { activeTabId: tab.id };
        return { tabs: [...state.tabs, tab], activeTabId: tab.id };
      }),

      closeTab: (id) => set((state) => {
        const newTabs = state.tabs.filter((tab) => tab.id !== id);
        return {
          tabs: newTabs,
          activeTabId: state.activeTabId === id ? (newTabs.length ? newTabs[newTabs.length - 1].id : null) : state.activeTabId
        };
      }),

      setActiveTab: (id) => set({ activeTabId: id }),

      updateTabId: (oldId, newId, newTitle) => set((state) => ({
        tabs: state.tabs.map((tab) =>
          tab.id === oldId ? { ...tab, id: newId, title: newTitle } : tab
        ),
        activeTabId: state.activeTabId === oldId ? newId : state.activeTabId,
      })),
    }),
    { name: 'auction-tabs' }
  )
);