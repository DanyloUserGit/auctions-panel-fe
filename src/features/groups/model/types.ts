import type { Auction } from '../../auctions/model/types';

export interface Group {
  id: string;
  title: string;
  groupAdminId: string;
  auctions: Auction[];
}
export interface GroupCreate {
<<<<<<< HEAD
    title: string;
    auctions: string[];
    groupAdminId: string | null;
=======
  title: string;
  auctions: string[];
  groupAdminId: string;
>>>>>>> 35b9de295eaeafde65b69e1c187f3fcfbac357fa
}
export interface GroupEdit {
  id?: string;
  title?: string;
  auctions?: string[];
  groupAdminId?: string;
}
