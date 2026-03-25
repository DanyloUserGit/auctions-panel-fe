import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LinkIcon from '@mui/icons-material/Link';
import PrintIcon from '@mui/icons-material/Print';
import {
  Box,
  Button,
  Collapse,
  Container,
  createTheme,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider,
  Typography
} from '@mui/material';
import { useState } from 'react';

// Твоя палітра кольорів
const theme = createTheme({
  palette: {
    primary: {
      main: '#1e40af',
      light: '#dbeafe',
    },
    secondary: {
      main: '#3b82f6', // accent
    },
    text: {
      secondary: '#64748b', // muted
    },
  },
});

// Типізація даних (на основі PHP логіки)
interface Transaction {
  id: number;
  date: string;
  diy: string;
  car: string;
  vin: string;
  marka: string;
  suma: number;
  effect: number;
  isPlus: boolean;
}

interface GroupedTransaction {
  id: string;
  date: string;
  title: string;
  car: string;
  vin: string;
  sumEffect: number;
  balance: number;
  items: Transaction[];
}

// Mock Data
const mockGroups: GroupedTransaction[] = [
  {
    id: 'g1',
    date: '2026-03-25',
    title: 'Volkswagen Golf',
    car: 'BC 1234 HT',
    vin: 'WVWZZZ1K...',
    sumEffect: -450.00,
    balance: 1550.00,
    items: [
      { id: 101, date: '2026-03-25', diy: 'Заміна масла', car: 'BC 1234 HT', vin: 'WVWZZZ1K...', marka: 'Volkswagen Golf', suma: 150, effect: -150, isPlus: false },
      { id: 102, date: '2026-03-25', diy: 'Ремонт ходової', car: 'BC 1234 HT', vin: 'WVWZZZ1K...', marka: 'Volkswagen Golf', suma: 300, effect: -300, isPlus: false },
    ]
  },
  {
    id: 'g2',
    date: '2026-03-24',
    title: 'Привезли (Поповнення)',
    car: '',
    vin: '',
    sumEffect: 2000.00,
    balance: 2000.00,
    items: [
      { id: 103, date: '2026-03-24', diy: 'Привезли готівку', car: '', vin: '', marka: '', suma: 2000, effect: 2000, isPlus: true },
    ]
  }
];

// Компонент рядка групи
const Row = ({ group }: { group: GroupedTransaction }) => {
  const [open, setOpen] = useState(false);
  const isNegative = group.sumEffect < 0;

  return (
    <>
      <TableRow
        sx={{
          '& > *': { borderBottom: 'unset' },
          cursor: 'pointer',
          '&:hover': { bgcolor: '#f1f5f9' } // sidebar-hover
        }}
        onClick={() => setOpen(!open)}
      >
        <TableCell size="small">
          <IconButton size="small">
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{group.date}</TableCell>
        <TableCell sx={{ fontWeight: 'bold' }}>
          {group.title}
          <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
            • платежів: {group.items.length}
          </Typography>
        </TableCell>
        <TableCell>{group.car || '—'}</TableCell>
        <TableCell>{group.vin}</TableCell>
        <TableCell align="right" sx={{ color: isNegative ? '#2f58cd' : '#009999', fontWeight: 'bold' }}>
          {isNegative ? '−' : '+'} {Math.abs(group.sumEffect).toLocaleString()} €
        </TableCell>
        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
          {group.balance.toLocaleString()} €
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, bgcolor: '#f8fbff', borderRadius: 1, p: 1, borderLeft: '4px solid #3b82f6' }}>
              <Table size="small">
                <TableBody>
                  {group.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell sx={{ border: 'none', color: 'text.secondary' }}>{item.date}</TableCell>
                      <TableCell sx={{ border: 'none', fontStyle: 'italic' }}>{item.diy}</TableCell>
                      <TableCell sx={{ border: 'none' }} align="right">
                        <Typography variant="body2" sx={{ color: item.isPlus ? '#009999' : '#2f58cd' }}>
                          {item.isPlus ? '+' : '−'} {item.suma} €
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ border: 'none', color: 'text.secondary' }} align="right">—</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default function BalanceSheet() {
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="flex-start" spacing={2} sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>Caddyluck Solution</Typography>
            <Typography variant="body2" color="text.secondary">ul. Ofiar Katynnia 19, 37-700 Przemyśl</Typography>
          </Box>
          <Box sx={{ textAlign: { md: 'right' } }}>
            <Typography variant="body2">Дата формування: {new Date().toLocaleDateString()}</Typography>
            <Typography variant="body1">Клієнт: <strong>Mykhailo</strong></Typography>
          </Box>
        </Stack>

        {/* Toolbar */}
        <Stack direction="row" spacing={2} sx={{ mb: 3 }} flexWrap="wrap">
          <TextField
            label="Станом на"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
          />
          <Button variant="contained" color="primary">Застосувати</Button>
          <Button startIcon={<PrintIcon />} variant="outlined">Друк</Button>
          <Button startIcon={<LinkIcon />} variant="outlined">Копіювати лінк</Button>
        </Stack>

        {/* Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell style={{ width: 40 }} />
                <TableCell>Дата</TableCell>
                <TableCell>Опис (Дія)</TableCell>
                <TableCell>Авто</TableCell>
                <TableCell>VIN/Кузов</TableCell>
                <TableCell align="right">Ефект</TableCell>
                <TableCell align="right">Баланс</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockGroups.map((group) => (
                <Row key={group.id} group={group} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Total */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6">Поточний баланс:</Typography>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            1 550.00 €
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}