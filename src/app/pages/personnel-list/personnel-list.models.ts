export interface PersonnelListItem {
  id: number;
  name: string;
  surname: string;
  email: string;
  personalNumber: string;
  dateOfBirth: string;
  rankId: number;
  rank: {
    id: number;
    name: string;
  }
  phoneNumber: string;
  enlistmentDate: string;
  isActive: boolean;
}

export interface PersonnelPage {
  personnels: PersonnelListItem[];
  totalPages: number;
  count: number;
}

export interface PersonnelPageResponse {
  success: boolean;
  personnel: PersonnelPage;
}

export interface RankOption {
  id: number;
  name: string;
}

export interface RanksResponse {
  success: boolean;
  ranks: RankOption[];
}

export interface RankIcons {
  id: number;
  src: string;
}
