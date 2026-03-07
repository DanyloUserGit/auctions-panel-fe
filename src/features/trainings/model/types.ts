export type MaterialStatus = 'Published' | 'Draft';

export interface TrainingMaterial {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    status: MaterialStatus;
    createdAt: string;
    category: string; // FAQ, Правила, Навчання
}

export interface InfoPage {
    slug: string;
    title: string;
    content: string;
}