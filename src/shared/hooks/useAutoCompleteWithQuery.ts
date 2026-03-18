import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { debounce } from '@mui/material';

interface UseAutocompleteProps<T> {
    queryKey: readonly unknown[];
    fetchFn: (query: string) => Promise<T[] | { data: T[] }>;
    debounceTime?: number;
}

export function useAutoCompleteWithQuery<T extends { id: string }>({
    queryKey,
    fetchFn,
    debounceTime = 400,
}: UseAutocompleteProps<T>) {
    const [searchQuery, setSearchQuery] = useState('');

    // 1. React Query для завантаження даних
    const { data, isLoading } = useQuery({
        queryKey: [...queryKey, searchQuery],
        queryFn: () => fetchFn(searchQuery),
        enabled: searchQuery.length > 0,
        staleTime: 5 * 60 * 1000,
    });

    // 2. Обчислюємо options безпосередньо з data (без додаткового useState та useEffect)
    const options = useMemo(() => {
        if (!data) return [];

        // Перевірка: чи є data масивом
        if (Array.isArray(data)) {
            return data;
        }

        // Перевірка: чи це об'єкт з полем { data: T[] }
        if (typeof data === 'object' && data !== null && 'data' in data) {
            return (data as { data: T[] }).data || [];
        }

        return [];
    }, [data]);

    // 3. Створюємо дебаунс-функцію для зміни пошукового запиту
    // Використовуємо useMemo, щоб функція не перестворювалася при кожному рендері
    const debouncedSetQuery = useMemo(
        () => debounce((val: string) => setSearchQuery(val), debounceTime),
        [debounceTime]
    );

    // 4. Фільтрація вже обраних елементів (щоб не пропонувати їх у списку)
    const getFilteredOptions = (currentSelected: T | T[] | null) => {
        const selectedIds = new Set(
            Array.isArray(currentSelected)
                ? currentSelected.map((s) => s.id)
                : currentSelected ? [currentSelected.id] : []
        );
        return options.filter((option) => !selectedIds.has(option.id));
    };

    return {
        options,
        getFilteredOptions,
        isLoading,
        // Передаємо значення у дебаунс-функцію
        onInputChange: (val: string) => debouncedSetQuery(val),
    };
}