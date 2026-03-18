import { useState, useCallback } from 'react';

export function useNotificationToast() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  // Використовуємо useCallback, щоб посилання на функцію було стабільним
  const showNotification = useCallback((text: string) => {
    setMessage(text);
    setIsOpen(true);
  }, []);

  const closeNotification = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    message,
    showNotification,
    closeNotification,
  };
}
