export interface UnitType {
  id: number;
  name: string;
  level: number;
  description: string;
}

export interface MilitaryUnit {
  id: number;
  name: string;
  unitTypeId: number;
  unitType: UnitType | null;
  parentUnitId: number | null;
  description: string;
  isActive: boolean;
}

export interface MilitaryUnitsPage {
  militaryUnits: MilitaryUnit[];
  totalPages: number;
  count: number;
}

export interface MilitaryUnitsResponse {
  success: boolean;
  militaryUnits: MilitaryUnitsPage;
}
