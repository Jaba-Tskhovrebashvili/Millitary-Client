export interface Rank {
  id: number;
  name: string;
}

export interface RanksResponse {
  success: boolean;
  ranks: Rank[];
}
