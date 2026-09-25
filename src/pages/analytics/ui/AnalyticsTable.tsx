import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { Box, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import type { CarMarketRow } from '../model/api';


interface AnalyticsTableProps {
  rows: CarMarketRow[];
  targetVin: string;
}

const AnalyticsTable = ({ rows, targetVin }: AnalyticsTableProps) => {
  const formatDate = (ts: number) => {
    if (!ts) return '-';
    return new Date(ts * 1000).toLocaleDateString('uk-UA');
  };

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 4, border: '1px solid #e5e7eb', boxShadow: 'none' }}>
      <Table sx={{ minWidth: 1000 }} size="small" aria-label="analytics data table">
        <TableHead sx={{ bgcolor: '#f8fafc' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 800 }}>Тип</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>Авто</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>Пробіг</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>Перша реєстрація</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>Потужність</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>Ціна</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>Дата аукціону</TableCell>
            <TableCell sx={{ fontWeight: 800 }} align="center">Дії</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            const isCurrent = row.chassis === targetVin;

            return (
              <TableRow
                key={row.id}
                sx={{
                  bgcolor: isCurrent ? '#fee2e2' : 'inherit',
                  '&:hover': { bgcolor: isCurrent ? '#fecaca' : '#f1f5f9' },
                }}
              >
                <TableCell>
                  <Box
                    component="img"
                    src={`/images/au_${row.auction_type}.png`}
                    sx={{ width: 24, height: 24, borderRadius: '50%' }}
                    alt={`Type ${row.auction_type}`}
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/24';
                    }}
                  />
                </TableCell>

                <TableCell sx={{ py: 2, maxWidth: 350 }}>
                  <Typography variant="body2" fontWeight="700">
                    {row.brand_name} {row.model_name} {row.eng_capacity} {row.transmission}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" display="block">
                    {row.characteristics || 'Характеристики відсутні'}
                  </Typography>
                  {row.chassis && (
                    <Typography variant="caption" fontWeight="900" sx={{ mt: 0.5, display: 'block' }}>
                      {row.chassis}
                    </Typography>
                  )}
                </TableCell>

                <TableCell>{row.mileage?.toLocaleString()} км</TableCell>
                <TableCell>{formatDate(row.first_on_road_ts)}</TableCell>
                <TableCell>{row.eng_power_kw} kW / {row.eng_power_hp} hp</TableCell>

                <TableCell sx={{ fontWeight: 800 }}>
                  € {row.price?.toLocaleString()}
                </TableCell>

                <TableCell>{formatDate(row.countdown_ts)}</TableCell>

                <TableCell align="center">
                  <Stack direction="row" spacing={0.5} justifyContent="center">
                    <IconButton size="small" title="Звіт" disabled={!row.report}>
                      <InsertDriveFileIcon fontSize="small" sx={{ color: row.report ? '#1e40af' : '#cbd5e1' }} />
                    </IconButton>
                    <IconButton size="small" title="Фото" disabled={!row.photos}>
                      <PhotoLibraryIcon fontSize="small" sx={{ color: row.photos ? '#1e40af' : '#cbd5e1' }} />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AnalyticsTable;