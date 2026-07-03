import { debounce } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';

interface UseAutocompleteProps<T> {
  fetchFn: (query: string) => Promise<T[] | { data: T[] }>; 
  initialSelected?: T | T[];
  debounceTime?: number;
}

export function useAutoComplete<T extends { id: string }>({
  fetchFn,
  initialSelected = [],
  debounceTime = 400,
}: UseAutocompleteProps<T>) {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<T[]>(() => {
    if (!initialSelected) return [];
    return Array.isArray(initialSelected) ? initialSelected : [initialSelected];
  });

  const updateOptions = useCallback(
    (newResults: T[], currentSelected: T | T[] | null) => {
      const selectedArray = Array.isArray(currentSelected)
        ? currentSelected
        : currentSelected
          ? [currentSelected]
          : [];

      const combined = [...selectedArray, ...newResults];
      const uniqueOptions = Array.from(
        new Map(combined.map((item) => [item.id, item])).values(),
      );
      setOptions(uniqueOptions);
    },
    [],
  );
  const debouncedFetch = useMemo(
    () =>
      debounce(async (query: string, currentSelected: T | T[] | null) => {
        if (!query.trim()) {
          updateOptions([], currentSelected);
          return;
        }

        setIsLoading(true);
        try {
          const response = await fetchFn(query);
          const results = Array.isArray(response) ? response : response.data;
          updateOptions(results || [], currentSelected);
        } catch (error) {
          console.error('Autocomplete fetch error:', error);
          setOptions(
            Array.isArray(currentSelected)
              ? currentSelected
              : currentSelected
                ? [currentSelected]
                : [],
          );
        } finally {
          setIsLoading(false);
        }
      }, debounceTime),
    [fetchFn, debounceTime, updateOptions],
  );

  const getFilteredOptions = (currentSelected: T | T[] | null) => {
    const selectedIds = new Set(
      Array.isArray(currentSelected)
        ? currentSelected.map((s) => s.id)
        : currentSelected
          ? [currentSelected.id]
          : [],
    );
    return options.filter((option) => !selectedIds.has(option.id));
  };
  return {
    options,
    getFilteredOptions,
    setOptions,
    isLoading,
    debouncedFetch,
  };
}
