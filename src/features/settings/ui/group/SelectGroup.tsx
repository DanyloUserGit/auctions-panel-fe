import { Search } from '@mui/icons-material';
import { Autocomplete, Paper, Stack, TextField } from '@mui/material';
import { useAutoCompleteWithQuery } from '../../../../shared/hooks/useAutoCompleteWithQuery';
import { fetchGroupByQuery } from '../../../groups/model/api-groups';
import type { Group } from '../../../groups/model/types';
import { useGroupById } from '../../../groups/model/useGroups';

interface Props {
  selectedGroupId: string;
  setSelectedGroup: (id: string) => void;
}

export default function SelectGroup({
  selectedGroupId,
  setSelectedGroup,
}: Props) {
  const groupsSearch = useAutoCompleteWithQuery<Group>({
    queryKey: ['search-groups'],
    fetchFn: fetchGroupByQuery,
  });

  const { data } = useGroupById(selectedGroupId);
  const groupDetail = data?.[0] || null;

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: '20px',
        border: '2px solid',
        borderColor: 'primary.main',
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Search color="primary" />
        <Autocomplete
          fullWidth
          options={groupsSearch.options || []}
          loading={groupsSearch.isLoading}
          value={groupDetail || null}
          onChange={(_, newValue) => setSelectedGroup(newValue?.id || '')}
          onInputChange={(_, val) => groupsSearch.onInputChange(val)}
          getOptionLabel={(option) => option.title || ''}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField {...params} label="Виберіть групу" variant="standard" />
          )}
        />
      </Stack>
    </Paper>
  );
}
