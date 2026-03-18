import { ArrowBack } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import React, { useEffect, useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router';
import { getBrands, getEstimate, getModels } from './model/api';
import type { ICalculationForm, ICalculationResult } from './model/types';

const CalculationPage: React.FC = () => {
    const [db] = useState<string>('table_extourcars1');
    const [tables] = useState<string[]>(['27031', '27032', '27033']);

    const navigate = useNavigate();

    const [brands, setBrands] = useState<string[]>([]);
    const [models, setModels] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState<ICalculationForm>({
        table: '27031',
        marka: '',
        model: '',
        year: '2018',
        auctionPrice: 5000,
        engineVolume: 2000,
        fuelType: 'petrol',
        road: 0,
        cert: 0,
        border: 0,
        towing: 0
    });

    const [result, setResult] = useState<ICalculationResult | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getBrands(db, form.table);
            setBrands(res.data)
        }
        fetchData();
    }, [form.table, db]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getModels(db, form.table, form.marka);
            setModels(res.data)
        }
        if (form.marka) {
            fetchData();
        }
    }, [form.marka, form.table, db]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const calculate = async () => {
        setLoading(true);
        try {

            const response = await getEstimate(db, form)
            setResult(response.data);
        } catch (error) {
            console.log("Помилка розрахунку: ", error);
        } finally {
            setLoading(false);
        }
    };

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
                    Розрахунок
                </Typography>
            </Box>

            <div className="grid grid-cols-2 gap-4">
                {/* Вибір таблиці */}
                <div>
                    <label className="block text-sm font-medium">Тип авто (Таблиця)</label>
                    <select name="table" value={form.table} onChange={handleInputChange} className="w-full border p-2 rounded">
                        {tables.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                {/* Вибір Марки */}
                <div>
                    <label className="block text-sm font-medium">Марка</label>
                    <select name="marka" value={form.marka} onChange={handleInputChange} className="w-full border p-2 rounded">
                        <option value="">Оберіть марку</option>
                        {brands.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                </div>

                {/* Вибір Моделі */}
                <div>
                    <label className="block text-sm font-medium">Модель</label>
                    <select name="model" value={form.model} onChange={handleInputChange} className="w-full border p-2 rounded">
                        <option value="">Оберіть модель</option>
                        {models.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>

                {/* Рік випуску */}
                <div>
                    <label className="block text-sm font-medium">Рік</label>
                    <input type="number" name="year" value={form.year} onChange={handleInputChange} className="w-full border p-2 rounded" />
                </div>

                {/* Нові поля: Об'єм та Паливо */}
                <div>
                    <label className="block text-sm font-medium">Об'єм двигуна (см³)</label>
                    <input type="number" name="engineVolume" value={form.engineVolume} onChange={handleInputChange} className="w-full border p-2 rounded" />
                </div>

                <div>
                    <label className="block text-sm font-medium">Тип палива</label>
                    <select name="fuelType" value={form.fuelType} onChange={handleInputChange} className="w-full border p-2 rounded">
                        <option value="petrol">Бензин</option>
                        <option value="diesel">Дизель</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium">Ціна на аукціоні (USD)</label>
                    <input type="number" name="auctionPrice" value={form.auctionPrice} onChange={handleInputChange} className="w-full border p-2 rounded" />
                </div>
            </div>

            <button
                onClick={calculate}
                disabled={loading}
                className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700"
            >
                {loading ? 'Рахуємо...' : 'Розрахувати вартість'}
            </button>

            {result && (
                <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                    <h2 className="text-xl font-bold mb-4">Результати розрахунку:</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Оціночна вартість (БД):</span>
                            <span className="font-bold">{result.basePriceFromDb} USD</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                            <span>Мито:</span>
                            <span>+{result.details.importDuty} USD</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                            <span>Акциз:</span>
                            <span>+{result.details.excise} USD</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                            <span>ПДВ (20%):</span>
                            <span>+{result.details.vat} USD</span>
                        </div>
                        <div className="flex justify-between font-bold pt-2 border-t">
                            <span>Всього розмитнення:</span>
                            <span>{result.details.totalCustoms} USD</span>
                        </div>
                        <div className="flex justify-between text-green-700 text-2xl font-black pt-4">
                            <span>РАЗОМ В УКРАЇНІ:</span>
                            <span>{result.totalInUkraine} USD</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CalculationPage;