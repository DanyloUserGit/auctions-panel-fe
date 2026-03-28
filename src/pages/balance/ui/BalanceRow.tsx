import {
  TableRow,
  TableCell,
  IconButton,
  Typography,
  Collapse,
  Box,
  Table,
  TableBody,
} from '@mui/material';
import { useState } from 'react';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import type { BalanceRecord } from '../model/types';
import dayjs from 'dayjs';

export const Row = ({ record }: { record: BalanceRecord }) => {
  const [open, setOpen] = useState(false);

  // Використовуємо eur як основну валюту для відображення (або змініть на потрібну)
  const mainAmount = record.balanceEur;
  const isNegative = !record.isPlus;

  return (
    <>
      <TableRow
        sx={{
          '& > *': { borderBottom: 'unset' },
          cursor: 'pointer',
          '&:hover': { bgcolor: '#f1f5f9' },
        }}
        onClick={() => setOpen(!open)}
      >
        <TableCell size="small">
          <IconButton size="small">
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>

        <TableCell sx={{ minWidth: 110 }}>
          <Box
            sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: 'text.primary' }}
            >
              {dayjs(record.date).format('DD MMMM')}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', fontSize: '0.75rem' }}
            >
              {dayjs(record.date).format('YYYY')} •{' '}
              {dayjs(record.date).format('dddd')}
            </Typography>
          </Box>
        </TableCell>

        <TableCell sx={{ fontWeight: 'bold' }}>
          {record.model}
          {record.notes && (
            <Typography
              variant="caption"
              sx={{ ml: 1, color: 'text.secondary', display: 'block' }}
            >
              {record.notes.substring(0, 30)}
              {record.notes.length > 30 ? '...' : ''}
            </Typography>
          )}
        </TableCell>

        <TableCell>{record.vin || '—'}</TableCell>

        <TableCell
          align="right"
          sx={{
            color: isNegative ? '#2f58cd' : '#009999',
            fontWeight: 'bold',
          }}
        >
          {isNegative ? '−' : '+'} {Math.abs(mainAmount).toLocaleString()} €
        </TableCell>

        {/* Якщо у вас є загальний баланс у стейті, підставте його тут. 
            Поки що залишаю як відображення суми в іншій валюті для прикладу */}
        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
          {record?.balanceUsd.toLocaleString()} $
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{
                margin: 1,
                bgcolor: '#f8fbff',
                borderRadius: 1,
                p: 2,
                borderLeft: '4px solid #3b82f6',
              }}
            >
              <Typography variant="subtitle2" gutterBottom component="div">
                Деталі транзакції (Розбивка по валютах):
              </Typography>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ border: 'none' }}>
                      USD: {record.effectUsd} $
                    </TableCell>
                    <TableCell sx={{ border: 'none' }}>
                      EUR: {record.effectEur} €
                    </TableCell>
                    <TableCell sx={{ border: 'none' }}>
                      PLN: {record.effectPln} zł
                    </TableCell>
                    <TableCell sx={{ border: 'none' }}>
                      UAH: {record.effectEur} ₴
                    </TableCell>
                  </TableRow>
                  {record.notes && (
                    <TableRow>
                      <TableCell sx={{ border: 'none' }} colSpan={4}>
                        <Typography
                          variant="body2"
                          sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                        >
                          Нотатки: {record.notes}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
