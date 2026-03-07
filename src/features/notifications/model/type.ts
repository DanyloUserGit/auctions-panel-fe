export interface NotificationSetting {
    id: string;
    type: string;
    inApp: boolean;
    email: boolean;
    telegram: boolean;
    isMandatory: boolean;
}