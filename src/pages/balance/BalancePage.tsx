import { ArrowBack } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
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
        setExpandedRows(prev => ({ ...prev, [clientName]: !prev[clientName] }));
    };

    const formatMoney = (val: number) => val ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00';

    return (
        (!balances || !clients) ? <Loader /> :
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
                <div className='flex flex-col gap-3'>
                    <div className="w-1/3 flex flex-col gap-2">
                        <label className="block text-sm font-medium mb-1">Оберіть клієнта</label>
                        <select
                            value={selectedClient}
                            onChange={(e) => setSelectedClient(e.target.value)}
                            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="ALL">-- Всі клієнти --</option>
                            {clients.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className='py-4'>
                                <tr className="bg-gray-100 text-gray-700 uppercase text-sm border-b">
                                    <th className="p-3 w-10"></th>
                                    <th className="p-3">Клієнт</th>
                                    <th className="p-3 text-right text-green-700">USD</th>
                                    <th className="p-3 text-right text-blue-700">EUR</th>
                                    <th className="p-3 text-right text-red-700">PLN</th>
                                    <th className="p-3 text-right text-gray-800">UAH</th>
                                </tr>
                            </thead>
                            <tbody>
                                {balances.map((clientData) => (
                                    <React.Fragment key={clientData.clientName}>
                                        <tr
                                            className="border-b hover:bg-gray-50 cursor-pointer font-bold"
                                            onClick={() => toggleRow(clientData.clientName)}
                                        >
                                            <td className="p-3 text-center text-gray-400">
                                                {expandedRows[clientData.clientName] ? '▼' : '▶'}
                                            </td>
                                            <td className="p-3 text-blue-900">{clientData.clientName}</td>
                                            <td className="p-3 text-right">{formatMoney(clientData.totalUsd)}</td>
                                            <td className="p-3 text-right">{formatMoney(clientData.totalEur)}</td>
                                            <td className="p-3 text-right">{formatMoney(clientData.totalPln)}</td>
                                            <td className="p-3 text-right">{formatMoney(clientData.totalUah)}</td>
                                        </tr>

                                        {/* Дочірні рядки (Деталізація по операціях/машинах) */}
                                        {expandedRows[clientData.clientName] && clientData.records.map((record, idx) => (
                                            <tr key={`${clientData.clientName}-record-${idx}`} className="bg-gray-50 border-b text-sm">
                                                <td></td>
                                                <td className="p-3 pl-8">
                                                    <div><span className="font-semibold">{record.model || 'Авто'}</span> ({record.vin})</div>
                                                    <div className="text-xs text-gray-500">{record.date ? new Date(record.date).toLocaleDateString() : 'Без дати'} • {record.notes}</div>
                                                </td>
                                                <td className={`p-3 text-right ${record.isPlus ? 'text-green-600' : 'text-red-600'}`}>
                                                    {record.usd > 0 ? `${record.isPlus ? '+' : '-'}${formatMoney(record.usd)}` : '-'}
                                                </td>
                                                <td className={`p-3 text-right ${record.isPlus ? 'text-green-600' : 'text-red-600'}`}>
                                                    {record.eur > 0 ? `${record.isPlus ? '+' : '-'}${formatMoney(record.eur)}` : '-'}
                                                </td>
                                                <td className={`p-3 text-right ${record.isPlus ? 'text-green-600' : 'text-red-600'}`}>
                                                    {record.pln > 0 ? `${record.isPlus ? '+' : '-'}${formatMoney(record.pln)}` : '-'}
                                                </td>
                                                <td className={`p-3 text-right ${record.isPlus ? 'text-green-600' : 'text-red-600'}`}>
                                                    {record.uah > 0 ? `${record.isPlus ? '+' : '-'}${formatMoney(record.uah)}` : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                                {balances.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-6 text-center text-gray-500">Немає даних для відображення</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
    );
};

export default BalancesPage;