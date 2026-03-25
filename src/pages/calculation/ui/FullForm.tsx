import { Box, Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { defaultSimpleForm, SIMPLE_STORAGE_KEY } from "../../../shared/constants/tables";
import { TabPanel } from "../../../shared/ui/TabPanel";
import { copyText } from "../../../shared/utils";
import type { CalculationTab, ISimpleCalcForm } from "../model/types";

// Колір з вашого дизайну
const MAIN_COLOR = '#009688';

export default function FullForm({ tab }: { tab: CalculationTab }) {
    const [simpleForm, setSimpleForm] = useState<ISimpleCalcForm>(defaultSimpleForm);
    const [copied, setCopied] = useState(false);

    // Вся логіка розрахунку тут (відбувається миттєво при зміні будь-якого поля)
    const simpleResult = useMemo(() => {
        const carName = `${simpleForm.carYear || ''} ${simpleForm.carBrand || ''} ${simpleForm.carModel || ''}`
            .replace(/\s+/g, ' ')
            .trim();

        // 1. Рахуємо суму в Євро
        const sumEUR =
            (simpleForm.stavka || 0) +
            (simpleForm.aukcion || 0) +
            (simpleForm.dostavka || 0) +
            (simpleForm.dodatkovi || 0) +
            (simpleForm.nashi || 0);

        // 2. Додаємо 0.5%
        const eur05 = sumEUR * 1.005;

        // 3. Конвертуємо в Долари
        const kurs = simpleForm.kurs || 1; // Захист від ділення/множення на 0
        const usd = eur05 * kurs;

        // 4. Рахуємо фінальну суму в Україні (в Доларах)
        const uaTotal =
            usd +
            (simpleForm.rozmitn || 0) +
            (simpleForm.doroga || 0) +
            (simpleForm.sertif || 0) +
            (simpleForm.kordon || 0) +
            (simpleForm.laveta || 0);

        // 5. Формуємо текст для копіювання
        const summaryText = [
            `Автомобіль: ${carName || 'Не вказано'}`,
            `Ставка: ${Math.round(simpleForm.stavka || 0)} EUR`,
            `Комісія аукціону: ${Math.round(simpleForm.aukcion || 0)} EUR`,
            `Доставка: ${Math.round(simpleForm.dostavka || 0)} EUR`,
            `Додаткові послуги: ${Math.round(simpleForm.dodatkovi || 0)} EUR`,
            `Юридичний супровід: ${Math.round(simpleForm.nashi || 0)} EUR`,
            `Разом: ${Math.round(sumEUR)} EUR`,
            `З урахуванням 0.5%: ${Math.round(eur05)} EUR`,
            `Курс EUR/USD: ${kurs}`,
            `Вартість в USD: ${Math.round(usd)} USD`,
            '',
            'В Україні:',
            `Автомобіль: ${Math.round(usd)} USD`,
            `Розмитнення: ${Math.round(simpleForm.rozmitn || 0)} USD`,
            `Дорога: ${Math.round(simpleForm.doroga || 0)} USD`,
            `Сертифікат: ${Math.round(simpleForm.sertif || 0)} USD`,
            `Кордон: ${Math.round(simpleForm.kordon || 0)} USD`,
            `Лавета: ${Math.round(simpleForm.laveta || 0)} USD`,
            `Разом в Україні: ${Math.round(uaTotal)} USD`,
            simpleForm.carLink ? '' : undefined,
            simpleForm.carLink ? `Посилання: ${simpleForm.carLink}` : undefined,
        ]
            .filter((row) => row !== undefined)
            .join('\n');

        return { carName, sumEUR, eur05, usd, uaTotal, summaryText };
    }, [simpleForm]);

    // ВИПРАВЛЕННЯ: Тепер це звичайна функція, яка повертає JSX, а не окремий React-компонент.
    // Це зберігає фокус при введенні!
    const renderInputRow = (label: string, field: keyof ISimpleCalcForm, currency: string) => (
        <Grid container alignItems="center" spacing={2} sx={{ mb: 1.5 }} key={field}>
            <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="body2">{label}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    fullWidth
                    size="small"
                    type="number"
                    value={simpleForm[field] === 0 ? 0 : (simpleForm[field] || '')}
                    onChange={(e) =>
                        setSimpleForm((prev) => ({
                            ...prev,
                            [field]: e.target.value === '' ? '' : Number(e.target.value),
                        } as unknown as ISimpleCalcForm)) 
                    }
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }}>
                <Typography variant="body2" color="text.secondary">
                    {currency}
                </Typography>
            </Grid>
        </Grid>
    );

    return (
        <TabPanel current={tab} value="finalCost">
            <Box sx={{ mt: 2 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                    Форма розрахунку автомобіля
                </Typography>

                {/* --- Верхній блок: Рік, Марка, Модель --- */}
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    {[
                        ['carYear', 'Рік', 2],
                        ['carBrand', 'Марка', 5],
                        ['carModel', 'Модель', 5],
                    ].map(([field, label, size]) => (
                        <Grid size={{ xs: 12, md: size as number }} key={field as string}>
                            <Stack spacing={0.5}>
                                <Typography variant="body2" color="text.secondary">{label}</Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={simpleForm[field as keyof ISimpleCalcForm] as string || ''}
                                    onChange={(e) =>
                                        setSimpleForm((prev) => ({
                                            ...prev,
                                            [field]: e.target.value,
                                        }))
                                    }
                                />
                            </Stack>
                        </Grid>
                    ))}
                </Grid>

                {/* --- Основний блок: 2 колонки --- */}
                <Grid container spacing={4}>

                    {/* ЛІВА КОЛОНКА (Інпути витрат) */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ bgcolor: MAIN_COLOR, color: 'white', py: 1, px: 2, borderRadius: 1, mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold" textAlign="center">
                                В Польщі
                            </Typography>
                        </Box>
                        <Box sx={{ px: 1 }}>
                            {/* ВИПРАВЛЕННЯ: Викликаємо як звичайну функцію */}
                            {renderInputRow("Ставка", "stavka", "EUR")}
                            {renderInputRow("Комісія аукціону", "aukcion", "EUR")}
                            {renderInputRow("Доставка", "dostavka", "EUR")}
                            {renderInputRow("Дод. послуги", "dodatkovi", "EUR")}
                            {renderInputRow("Юридичний супровід", "nashi", "EUR")}
                            {renderInputRow("Курс EUR/USD", "kurs", "")}
                        </Box>

                        <Box sx={{ bgcolor: MAIN_COLOR, color: 'white', py: 1, px: 2, borderRadius: 1, mb: 2, mt: 3 }}>
                            <Typography variant="subtitle1" fontWeight="bold" textAlign="center">
                                В Україні
                            </Typography>
                        </Box>
                        <Box sx={{ px: 1 }}>
                            {renderInputRow("Розмитнення", "rozmitn", "USD")}
                            {renderInputRow("Дорога", "doroga", "USD")}
                            {renderInputRow("Сертифікат", "sertif", "USD")}
                            {renderInputRow("Кордон", "kordon", "USD")}
                            {renderInputRow("Лавета", "laveta", "USD")}
                        </Box>
                    </Grid>

                    {/* ПРАВА КОЛОНКА (Посилання та Підсумок) */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Stack spacing={0.5} sx={{ mb: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                                Посилання на авто:
                            </Typography>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Вставте URL"
                                value={simpleForm.carLink || ''}
                                onChange={(e) =>
                                    setSimpleForm((prev) => ({
                                        ...prev,
                                        carLink: e.target.value,
                                    }))
                                }
                            />
                        </Stack>

                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                            Підсумок
                        </Typography>

                        <Box sx={{
                            bgcolor: MAIN_COLOR,
                            color: 'white',
                            p: 2.5,
                            borderRadius: 2,
                            whiteSpace: 'pre-wrap',
                            fontFamily: 'monospace',
                            fontSize: '14px',
                            minHeight: '200px'
                        }}>
                            {simpleResult.summaryText}
                        </Box>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 3 }}>
                            <Button
                                variant="contained"
                                sx={{ bgcolor: MAIN_COLOR, '&:hover': { bgcolor: '#00796B' }, textTransform: 'none' }}
                                onClick={() => {
                                    copyText(simpleResult.summaryText).then(() => {
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 1500);
                                    });
                                }}
                            >
                                {copied ? 'Скопійовано' : 'Копіювати підсумок'}
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{ color: MAIN_COLOR, borderColor: MAIN_COLOR, textTransform: 'none' }}
                                onClick={() => setSimpleForm(defaultSimpleForm)}
                            >
                                Очистити всі поля
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{ color: MAIN_COLOR, borderColor: MAIN_COLOR, textTransform: 'none' }}
                                onClick={() => {
                                    localStorage.removeItem(SIMPLE_STORAGE_KEY);
                                    setSimpleForm(defaultSimpleForm);
                                }}
                            >
                                Очистити localStorage
                            </Button>
                        </Stack>
                    </Grid>

                </Grid>
            </Box>
        </TabPanel>
    )
}