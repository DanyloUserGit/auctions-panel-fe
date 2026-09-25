export interface Path {
  id: string;
  path: string;
}
export interface Selector {
  id: string;
  selector: string;
}
export type LogSeverity = 'Info' | 'Warning' | 'Critical';

export const SEVERITY_OPTIONS: { value: LogSeverity; label: string }[] = [
  { value: 'Info', label: 'Info (Стандарт)' },
  { value: 'Warning', label: 'Warning (Попередження)' },
  { value: 'Critical', label: 'Critical (Критичні помилки)' },
];

export interface GlobalSettingsDTO {
  inactivityTimeout?: number;
  globalSessionLimit?: number;
  sessionMaxConnections?: number;
  sessionRetentionDays?: number;
  streamFps?: number;
  streamQuality?: number;
  streamBitrateKbps?: number;
  gaCanAssignGa?: boolean;
  loggingPolicy?: LogSeverity;
}
