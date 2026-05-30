// data/types.ts
export type PerfumeCategory = 'CLEAN' | 'CITRUS' | 'GOURMAND' | 'BOLD' | 'FRUITY';

export interface PerfumeEntry {
  id: number;
  brand: string;
  name: string;
  img: string;
  spl: number;
  period: string;
  weather: string;
  topNotes: string;
  middleNotes: string;
  baseNotes: string;
  category: PerfumeCategory;
  notes: string[];
  price: number;
  physicalAttributes: {
    shape: string;
    liquidColor: string;
    capColor: string;
  };
}