import { useCallback, useState } from 'react';

export const useModal = (initialState: boolean) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((state) => !state), []);
  return {
    isOpen,
    open,
    close,
    toggle,
  };
};
