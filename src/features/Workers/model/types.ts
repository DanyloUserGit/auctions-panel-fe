export const RIGHTS = ['Read', 'Write', 'All'] as const;

export const RIGHTS_LABELS: Record<string, string> = {
    Read: 'Тільки перегляд (Read Only)',
    Write: 'Запис (Write)',
    All: 'Повні права (All)',
};