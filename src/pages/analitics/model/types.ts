export interface CarAnalytics {
    market_has_analytics: boolean;
    market_count: number;
    market_zone_color: string;
    market_zone_label: string;
    market_predicted_price_by_mileage?: number | null;
    market_count_raw?: number;
    market_outliers_removed?: number;
    market_diff_pct?: number | null;
    market_floor?: number | null;
    market_min?: number | null;
    market_p25?: number | null;
    market_median?: number | null;
    market_p75?: number | null;
    market_max?: number | null;
    current_display_price?: number;
    market_vs_predicted_diff?: number | null;
    market_vs_predicted_diff_pct?: number | null;
}