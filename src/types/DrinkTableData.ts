import type { DrinkTableRow } from './DrinkTableRow';

export interface DrinkTableData {
  rows: DrinkTableRow[];
  shipFee: number;
  discount: number;
}
