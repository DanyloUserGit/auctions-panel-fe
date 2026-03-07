import { Search, Close } from '@mui/icons-material';
import { TextField, InputAdornment, IconButton, Box } from '@mui/material';
import { useState, type ChangeEvent } from 'react';

interface GroupSearchProps {
  onSearch?: (value: string) => void;
  placeholder?: string;
}

export default function GroupSearch({
  onSearch,
  placeholder = 'Пошук групи за назвою...',
}: GroupSearchProps) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    onSearch?.(value);
  };

  const handleClear = () => {
    setSearchValue('');
    onSearch?.('');
  };

  return (
    <Box
      sx={{
        width: { xs: '100%', sm: '300px', md: '400px' },
        mb: { xs: 2, sm: 0 },
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        placeholder={placeholder}
        value={searchValue}
        onChange={handleSearchChange}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: 'background.paper',
            transition: '0.2s',
            '&:hover': {
              backgroundColor: '#fcfcfc',
            },
            '&.Mui-focused': {
              backgroundColor: '#fff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: 'text.secondary', fontSize: 20 }} />
            </InputAdornment>
          ),
          endAdornment: searchValue && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleClear} edge="end">
                <Close sx={{ fontSize: 18 }} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}
