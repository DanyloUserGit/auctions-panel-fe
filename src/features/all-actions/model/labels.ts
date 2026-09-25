import type { SessionEndReason, SessionEventType, SessionStatus } from './types';

export const EVENT_TYPES: Record<SessionEventType, { label: string; color: 'error' | 'warning' | 'info' | 'default' | 'primary' | 'secondary' }> = {
  ForbiddenAction: { label: 'Заборонена дія', color: 'error' },
  Navigation: { label: 'Перехід', color: 'info' },
  SessionError: { label: 'Помилка сесії', color: 'warning' },
  TextInput: { label: 'Введення тексту', color: 'default' },
  ButtonClick: { label: 'Натиск кнопки', color: 'primary' },
  Other: { label: 'Інше', color: 'secondary' },
};

export const SESSION_STATUS: Record<SessionStatus, { label: string; color: 'success' | 'default' | 'error' }> = {
  active: { label: 'Активна', color: 'success' },
  ended: { label: 'Завершена', color: 'default' },
  error: { label: 'Помилка', color: 'error' },
};

export const END_REASON: Record<SessionEndReason, string> = {
  Admin: 'завершив адміністратор',
  Inactivity: 'таймаут бездіяльності',
  NoConnections: 'від’єдналися всі користувачі',
  Error: 'збій',
};

export const fullName = (u?: { firstName: string; lastName: string; email?: string } | null) =>
  u ? `${u.firstName} ${u.lastName}`.trim() || u.email || '' : '';
