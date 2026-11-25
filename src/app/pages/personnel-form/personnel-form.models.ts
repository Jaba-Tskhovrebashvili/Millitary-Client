export interface PersonnelPayload {
  name: string;
  surname: string;
  email: string;
  personalNumber: string;
  dateOfBirth: string;
  rankId: number;
  phoneNumber: string;
  enlistmentDate: string;
  isActive: boolean;
}

export interface PersonnelRecord extends PersonnelPayload {
  id: number;
}

export interface PersonnelRecordResponse {
  success: boolean;
  personnel: PersonnelRecord;
}

export interface RankOption {
  id: number;
  name: string;
}

export interface RanksResponse {
  success: boolean;
  ranks: RankOption[];
}

export interface MessageResponse {
  success: boolean;
  message: string;
}
