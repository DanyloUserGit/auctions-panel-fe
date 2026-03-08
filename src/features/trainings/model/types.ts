import type { UserRole } from '../../auth/model/user-schema';

export type MaterialStatus = 'Published' | 'Draft';

export interface Training {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  visibility: MaterialVisibilityType;
  allowedRoles: UserRole[];
  groupId: string;
}

export interface CreateTraining {
  title: string;
  content: string;
  visibility?: MaterialVisibilityType;
  allowedRoles?: UserRole[];
  groupId?: string;
}

export interface EditTraining {
  title?: string;
  content?: string;
  imageUrl?: string;
  visibility?: MaterialVisibilityType;
  allowedRoles?: UserRole[];
  groupId?: string;
}
export interface InfoPage {
  slug: string;
  title: string;
  content: string;
}

export const MaterialVisibility = ['Groups', 'Role', 'All'] as const;
export type MaterialVisibilityType = (typeof MaterialVisibility)[number];

export interface TrainingMaterial {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  isPublished: boolean;
  visibility: MaterialVisibilityType;
  allowedRoles?: string[];
  groupId?: string;
  createdAt: string;
}
