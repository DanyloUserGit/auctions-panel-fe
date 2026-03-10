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
  isPublished: boolean
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

export const MaterialVisibility = ['Group', 'All'] as const;
export type MaterialVisibilityType = (typeof MaterialVisibility)[number];

