import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import {
  Box,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

// Mock дані на основі скріншота
const mockRows = [
  {
    id: 1,
    type: 2,
    brand: 'Audi Q2 1498 cm³ Automatic',
    subTitle: '35 TFSI Business Line 1.5 TFSI 150CV BVA7 E6d',
    vin: 'WAUZZZGA0MA047879',
    mileage: 109401,
    registration: '01-06-2021',
    power: '110 kW',
    price: 14500,
    auctionDate: '11-03-2026',
    isCurrent: true, // Підсвічування поточного VIN
  },
  {
    id: 2,
    type: 0,
    brand: 'Audi Q2 1498 cm³ Automatic',
    subTitle:
      'AUDI / 2020 / 5P / todoterreno Advanced 35 TFSI 110kW (150CV) S tronic (AC)',
    vin: '',
    mileage: 207813,
    registration: '01-04-2021',
    power: '110 kW',
    price: 9339,
    auctionDate: '24-03-2026',
    isCurrent: false,
  },
];

const AnalyticsTable = () => {
  return (
    <TableContainer
      component={Paper}
      sx={{ borderRadius: 4, border: '1px solid #e5e7eb', boxShadow: 'none' }}
    >
      <Table
        sx={{ minWidth: 1000 }}
        size="small"
        aria-label="analytics data table"
      >
        <TableHead sx={{ bgcolor: '#f8fafc' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 800 }}>Тип</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>Авто</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>Пробіг</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>Перша реєстрація</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>Потужність</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>Ціна</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>Дата аукціону</TableCell>
            <TableCell sx={{ fontWeight: 800 }} align="center">
              Дії
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mockRows.map((row) => (
            <TableRow
              key={row.id}
              sx={{
                bgcolor: row.isCurrent ? '#fee2e2' : 'inherit', // Рожеве підсвічування для поточного авто
                '&:hover': { bgcolor: row.isCurrent ? '#fecaca' : '#f1f5f9' },
              }}
            >
              {/* Іконка типу аукціону  */}
              <TableCell>
                <Box
                  component="img"
                  src={`/images/au_${row.type + 1}.png`}
                  sx={{ width: 24, height: 24, borderRadius: '50%' }}
                  alt={`Type ${row.type}`}
                  onError={(
                    e: React.SyntheticEvent<HTMLImageElement, Event>,
                  ) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/24';
                  }}
                />
              </TableCell>

              {/* Деталі автомобіля  */}
              <TableCell sx={{ py: 2, maxWidth: 350 }}>
                <Typography variant="body2" fontWeight="700">
                  {row.brand}
                </Typography>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  display="block"
                >
                  {row.subTitle}
                </Typography>
                {row.vin && (
                  <Typography
                    variant="caption"
                    fontWeight="900"
                    sx={{ mt: 0.5, display: 'block' }}
                  >
                    {row.vin}
                  </Typography>
                )}
              </TableCell>

              <TableCell>{row.mileage.toLocaleString()}</TableCell>
              <TableCell>{row.registration}</TableCell>
              <TableCell>{row.power}</TableCell>

              <TableCell sx={{ fontWeight: 800 }}>
                € {row.price.toLocaleString()}
              </TableCell>

              <TableCell>{row.auctionDate}</TableCell>

              {/* Кнопки дій (Звіти та Фото)  */}
              <TableCell align="center">
                <Stack direction="row" spacing={0.5} justifyContent="center">
                  <IconButton size="small" title="Звіт">
                    <InsertDriveFileIcon
                      fontSize="small"
                      sx={{ color: '#64748b' }}
                    />
                  </IconButton>
                  <IconButton size="small" title="Фото">
                    <PhotoLibraryIcon
                      fontSize="small"
                      sx={{ color: '#64748b' }}
                    />
                  </IconButton>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AnalyticsTable;
