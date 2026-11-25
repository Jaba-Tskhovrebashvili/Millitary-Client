export interface Position {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

export interface PositionsResponse {
  success: boolean;
  positions: Position[];
}
