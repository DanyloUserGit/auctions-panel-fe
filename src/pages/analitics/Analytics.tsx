import { ArrowBack } from '@mui/icons-material';
import { Alert, Box, Button, CircularProgress, IconButton, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useData } from './model/useData';

export const Analytics: React.FC = () => {
    const [inputId, setInputId] = useState<string>('');
    const [activeCarId, setActiveCarId] = useState<number | null>(null);

    const { data, isLoading, isError, error, isFetching } = useData(activeCarId);

    const handleFetch = () => {
        const id = parseInt(inputId, 10);
        if (!isNaN(id)) {
            setActiveCarId(id);
        }
    };
    const navigate = useNavigate();

    const showLoader = isLoading || isFetching;

    const [isOpen, setIsOpen] = useState(false);

    return (
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
                    Аналітика
                </Typography>
            </Box>
            <div className="flex flex-col gap-4 p-20 max-w-2xl mx-auto font-sans m-10">
                {/* Форма пошуку */}
                <Box className="flex gap-3 items-center">
                    <TextField
                        label="ID автомобіля"
                        variant="outlined"
                        size="small"
                        type="number"
                        value={inputId}
                        onChange={(e) => setInputId(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
                        className="flex-grow"
                    />
                    <Button
                        variant="contained"
                        onClick={handleFetch}
                        disabled={showLoader || !inputId}
                        className="min-w-[120px]"
                    >
                        {showLoader ? <CircularProgress size={24} color="inherit" /> : 'Аналізувати'}
                    </Button>
                </Box>

                {isError && (
                    <Alert severity="error">
                        {error?.message || 'Помилка завантаження даних'}
                    </Alert>
                )}

                {/* Точна копія логіки з market_analytics_list.tpl */}
                {data && data.market_has_analytics && data.market_count > 0 && (
                    <div
                        style={{
                            margin: '8px 0 6px 0',
                            borderRadius: '10px',
                            border: `1px solid ${data.market_zone_color}`,
                            background: 'rgba(255,255,255,0.92)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Header */}
                        <div
                            onClick={() => setIsOpen(!isOpen)}
                            style={{ cursor: 'pointer', padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}
                        >
                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                                <span style={{
                                    display: 'inline-block',
                                    padding: '4px 10px',
                                    borderRadius: '999px',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    color: '#fff',
                                    background: data.market_zone_color,
                                }}>
                                    {data.market_zone_label}
                                </span>

                                <span style={{ fontSize: '12px', color: '#374151' }}>
                                    <b>Прогнозована ціна по пробігу:</b>{' '}
                                    {data.market_predicted_price_by_mileage !== null && data.market_predicted_price_by_mileage !== undefined
                                        ? `€${Math.round(data.market_predicted_price_by_mileage)}`
                                        : '—'}
                                </span>
                            </div>

                            <div style={{ minWidth: '22px', height: '22px', lineHeight: '20px', textAlign: 'center', borderRadius: '50%', border: '1px solid #d1d5db', color: '#374151', fontWeight: 700, fontSize: '16px' }}>
                                {isOpen ? '−' : '+'}
                            </div>
                        </div>

                        {/* Body */}
                        {isOpen && (
                            <div style={{ padding: '0 12px 12px 12px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>

                                {/* Рядок статистики */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', margin: '8px 0 6px 0' }}>
                                    <span style={{ fontSize: '12px', color: '#555' }}>
                                        Аналогів після чистки: <b>{data.market_count}</b>
                                    </span>

                                    {data.market_count_raw !== undefined && (
                                        <span style={{ fontSize: '12px', color: '#555' }}>
                                            Було до чистки: <b>{data.market_count_raw}</b>
                                        </span>
                                    )}

                                    {data.market_outliers_removed !== undefined && data.market_outliers_removed > 0 && (
                                        <span style={{ fontSize: '12px', color: '#555' }}>
                                            Викидів прибрано: <b>{data.market_outliers_removed}</b>
                                        </span>
                                    )}

                                    {data.market_diff_pct !== null && data.market_diff_pct !== undefined && (
                                        <span style={{ fontSize: '12px', color: '#555' }}>
                                            Відхилення від медіани:{' '}
                                            <b style={{ color: data.market_diff_pct < 0 ? '#16a34a' : data.market_diff_pct > 0 ? '#dc2626' : '#111' }}>
                                                {data.market_diff_pct > 0 ? '+' : ''}{data.market_diff_pct.toFixed(1)}%
                                            </b>
                                        </span>
                                    )}
                                </div>

                                {/* Рядок маркерів ринку */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '12px', lineHeight: '1.5' }}>
                                    <span style={{ color: '#15803d' }}><b>Низ ринку:</b> {data.market_floor !== null && data.market_floor !== undefined ? `€${Math.round(data.market_floor)}` : '—'}</span>
                                    <span style={{ color: '#16a34a' }}><b>Min:</b> {data.market_min !== null && data.market_min !== undefined ? `€${Math.round(data.market_min)}` : '—'}</span>
                                    <span style={{ color: '#16a34a' }}><b>P25:</b> {data.market_p25 !== null && data.market_p25 !== undefined ? `€${Math.round(data.market_p25)}` : '—'}</span>
                                    <span style={{ color: '#ca8a04' }}><b>Median:</b> {data.market_median !== null && data.market_median !== undefined ? `€${Math.round(data.market_median)}` : '—'}</span>
                                    <span style={{ color: '#f97316' }}><b>P75:</b> {data.market_p75 !== null && data.market_p75 !== undefined ? `€${Math.round(data.market_p75)}` : '—'}</span>
                                    <span style={{ color: '#dc2626' }}><b>Max:</b> {data.market_max !== null && data.market_max !== undefined ? `€${Math.round(data.market_max)}` : '—'}</span>
                                </div>

                                {/* Коридор ринку */}
                                <div style={{ marginTop: '6px', fontSize: '12px', color: '#374151' }}>
                                    <b>Коридор ринку:</b>{' '}
                                    {data.market_p25 !== null && data.market_p75 !== null && data.market_p25 !== undefined && data.market_p75 !== undefined
                                        ? `€${Math.round(data.market_p25)} – €${Math.round(data.market_p75)}`
                                        : '—'
                                    }
                                </div>

                                {/* Блок прогнозованої ціни */}
                                {data.market_predicted_price_by_mileage !== null && data.market_predicted_price_by_mileage !== undefined && (
                                    <div style={{ marginTop: '8px', padding: '8px 10px', borderRadius: '8px', background: '#f8fafc', border: '1px dashed #cbd5e1' }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '12px', lineHeight: '1.6', alignItems: 'center' }}>
                                            <span style={{ color: '#0f172a' }}>
                                                <b>Прогнозована ціна по пробігу:</b>{' '}
                                                <span style={{ fontWeight: 700, color: '#111827' }}>
                                                    €{Math.round(data.market_predicted_price_by_mileage)}
                                                </span>
                                            </span>

                                            {data.current_display_price !== undefined && data.current_display_price > 0 && (
                                                <span style={{ color: '#0f172a' }}>
                                                    <b>Поточна ціна:</b>{' '}
                                                    <span style={{ fontWeight: 700, color: '#111827' }}>
                                                        €{Math.round(data.current_display_price)}
                                                    </span>
                                                </span>
                                            )}

                                            {data.market_vs_predicted_diff !== null && data.market_vs_predicted_diff !== undefined && (
                                                <span style={{ color: '#0f172a' }}>
                                                    <b>Поточна ціна vs прогноз:</b>{' '}
                                                    <span style={{ fontWeight: 700, color: data.market_vs_predicted_diff < 0 ? '#16a34a' : data.market_vs_predicted_diff > 0 ? '#dc2626' : '#111827' }}>
                                                        {data.market_vs_predicted_diff > 0 ? '+' : ''}€{Math.round(data.market_vs_predicted_diff)}{' '}
                                                        {data.market_vs_predicted_diff_pct !== null && data.market_vs_predicted_diff_pct !== undefined && (
                                                            <span>
                                                                ({data.market_vs_predicted_diff_pct > 0 ? '+' : ''}{data.market_vs_predicted_diff_pct.toFixed(1)}%)
                                                            </span>
                                                        )}
                                                    </span>
                                                </span>
                                            )}
                                        </div>

                                        <div style={{ marginTop: '4px', fontSize: '11px', color: '#64748b' }}>
                                            Прогнозована ціна по пробігу — орієнтовна ринкова ціна з урахуванням залежності вартості від пробігу серед знайдених аналогів.
                                        </div>
                                    </div>
                                )}

                                {/* Інформаційні тексти внизу */}
                                <div style={{ marginTop: '5px', fontSize: '11px', color: '#6b7280' }}>
                                    Низ ринку — нижній робочий орієнтир без поодиноких аномальних цін. Коридор ринку — діапазон від 25 до 75 перцентиля.
                                </div>

                                {data.market_outliers_removed !== undefined && data.market_outliers_removed > 0 && (
                                    <div style={{ marginTop: '4px', fontSize: '11px', color: '#6b7280' }}>
                                        * Аномальні поодинокі ціни, що сильно вибивалися із загальної картини, не враховано.
                                    </div>
                                )}

                                <div style={{ marginTop: '5px', fontSize: '11px', color: '#6b7280' }}>
                                    Зелений — нижче 25 перцентиля, жовтий — від 25 до 50 перцентиля, помаранчевий — від 50 до 75 перцентиля, червоний — вище 75 перцентиля.
                                </div>

                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};