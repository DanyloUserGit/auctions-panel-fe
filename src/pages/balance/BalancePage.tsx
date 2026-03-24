import { ArrowBack } from '@mui/icons-material';
import {
  Box,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Loader } from '../../shared/ui/Loader';
import { useBalanceClients, useBalanceData } from './model/useBalances';

const BalancesPage: React.FC = () => {
  const [db] = useState<string>('table_extourcars1');

  const [selectedClient, setSelectedClient] = useState<string>('ALL');

  const navigate = useNavigate();

  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const { clients } = useBalanceClients(db);
  const { balances } = useBalanceData(db, selectedClient);

  const toggleRow = (clientName: string) => {
    setExpandedRows((prev) => ({ ...prev, [clientName]: !prev[clientName] }));
  };

  const formatMoney = (val: number) =>
    val ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00';

  return !balances || !clients ? (
    <Loader />
  ) : (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', my: 3, gap: 1 }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ color: 'text.secondary' }}
        >
          <ArrowBack />
        </IconButton>
        <Typography
          variant="h5"
          sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}
        >
          Баланси
        </Typography>
      </Box>

      <div className="flex flex-col gap-5">
        <FormControl className="w-full sm:w-1/3">
          <InputLabel id="client-select-label">Оберіть клієнта</InputLabel>
          <Select
            labelId="client-select-label"
            value={selectedClient}
            label="Оберіть клієнта"
            onChange={(e) => setSelectedClient(e.target.value)}
          >
            <MenuItem value="ALL">-- Всі клієнти --</MenuItem>
            {clients.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TableContainer component={Paper} elevation={0} className="border border-gray-200">
          <Table className="w-full">
            <TableHead className="bg-gray-100">
              <TableRow>
                <TableCell className="w-10"></TableCell>
                <TableCell className="uppercase text-gray-700 text-sm font-semibold">
                  Клієнт
                </TableCell>
                <TableCell align="right" className="uppercase text-green-700 text-sm font-semibold">
                  USD
                </TableCell>
                <TableCell align="right" className="uppercase text-blue-700 text-sm font-semibold">
                  EUR
                </TableCell>
                <TableCell align="right" className="uppercase text-red-700 text-sm font-semibold">
                  PLN
                </TableCell>
                <TableCell align="right" className="uppercase text-gray-800 text-sm font-semibold">
                  UAH
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {balances.map((clientData) => (
                <React.Fragment key={clientData.clientName}>
                  <TableRow
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleRow(clientData.clientName)}
                  >
                    <TableCell align="center" className="text-gray-400">
                      {expandedRows[clientData.clientName] ? '▼' : '▶'}
                    </TableCell>
                    <TableCell className="font-bold text-blue-900">
                      {clientData.clientName}
                    </TableCell>
                    <TableCell align="right" className="font-bold">
                      {formatMoney(clientData.totalUsd)}
                    </TableCell>
                    <TableCell align="right" className="font-bold">
                      {formatMoney(clientData.totalEur)}
                    </TableCell>
                    <TableCell align="right" className="font-bold">
                      {formatMoney(clientData.totalPln)}
                    </TableCell>
                    <TableCell align="right" className="font-bold">
                      {formatMoney(clientData.totalUah)}
                    </TableCell>
                  </TableRow>

                  {/* Дочірні рядки (Деталізація по операціях/машинах) */}
                  {expandedRows[clientData.clientName] &&
                    clientData.records.map((record, idx) => (
                      <TableRow
                        key={`${clientData.clientName}-record-${idx}`}
                        className="bg-gray-50"
                      >
                        <TableCell></TableCell>
                        <TableCell className="pl-8">
                          <div>
                            <span className="font-semibold">
                              {record.model || 'Авто'}
                            </span>{' '}
                            ({record.vin})
                          </div>
                          <div className="text-xs text-gray-500">
                            {record.date
                              ? new Date(record.date).toLocaleDateString()
                              : 'Без дати'}{' '}
                            • {record.notes}
                          </div>
                        </TableCell>
                        <TableCell
                          align="right"
                          className={record.isPlus ? 'text-green-600' : 'text-red-600'}
                        >
                          {record.usd > 0
                            ? `${record.isPlus ? '+' : '-'}${formatMoney(record.usd)}`
                            : '-'}
                        </TableCell>
                        <TableCell
                          align="right"
                          className={record.isPlus ? 'text-green-600' : 'text-red-600'}
                        >
                          {record.eur > 0
                            ? `${record.isPlus ? '+' : '-'}${formatMoney(record.eur)}`
                            : '-'}
                        </TableCell>
                        <TableCell
                          align="right"
                          className={record.isPlus ? 'text-green-600' : 'text-red-600'}
                        >
                          {record.pln > 0
                            ? `${record.isPlus ? '+' : '-'}${formatMoney(record.pln)}`
                            : '-'}
                        </TableCell>
                        <TableCell
                          align="right"
                          className={record.isPlus ? 'text-green-600' : 'text-red-600'}
                        >
                          {record.uah > 0
                            ? `${record.isPlus ? '+' : '-'}${formatMoney(record.uah)}`
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                </React.Fragment>
              ))}
              {balances.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" className="py-6 text-gray-500">
                    Немає даних для відображення
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default BalancesPage;