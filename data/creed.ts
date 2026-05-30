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
  physicalAttributes: {
    shape: string;
    liquidColor: string;
    capColor: string;
  };
  price: number;
}

export const creedPerfumes: PerfumeEntry[] = [
  {
    id: 9828,
    brand: 'Creed',
    name: 'Aventus',
    img: 'https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.9828.avif',
    spl: 9,
    period: 'Day to night',
    weather: 'Versatile',
    topNotes: 'Bergamot, Black Currant, Apple, Lemon, Pink Pepper',
    middleNotes: 'Pineapple, Patchouli, Moroccan Jasmine',
    baseNotes: 'Birch, Musk, Oak Moss, Cedarwood, Ambroxan',
    category: 'FRUITY',
    notes: ['Bergamot', 'Black Currant', 'Apple', 'Lemon', 'Pink Pepper', 'Pineapple', 'Patchouli', 'Moroccan Jasmine', 'Birch', 'Musk', 'Oak Moss', 'Cedarwood', 'Ambroxan'],
    physicalAttributes: {
      shape: 'Rectangular flacon',
      liquidColor: 'Clear pale gold',
      capColor: 'Black',
    },
    price: 4900000,
  },
  {
    id: 474,
    brand: 'Creed',
    name: 'Green Irish Tweed',
    img: 'https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.474.avif',
    spl: 8,
    period: 'Daytime',
    weather: 'Versatile',
    topNotes: 'Iris, Vervain',
    middleNotes: 'Violet Leaf',
    baseNotes: 'Ambergris, Sandalwood',
    category: 'CLEAN',
    notes: ['Iris', 'Vervain', 'Violet Leaf', 'Ambergris', 'Sandalwood'],
    physicalAttributes: {
      shape: 'Rectangular flacon',
      liquidColor: 'Clear pale green',
      capColor: 'Black',
    },
    price: 4900000,
  },
  {
    id: 472,
    brand: 'Creed',
    name: 'Silver Mountain Water',
    img: 'https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.472.avif',
    spl: 7,
    period: 'Daytime',
    weather: 'Panas',
    topNotes: 'Bergamot, Mandarin Orange',
    middleNotes: 'Green Tea, Black Currant',
    baseNotes: 'Musk, Petitgrain, Sandalwood, Galbanum',
    category: 'CITRUS',
    notes: ['Bergamot', 'Mandarin Orange', 'Green Tea', 'Black Currant', 'Musk', 'Petitgrain', 'Sandalwood', 'Galbanum'],
    physicalAttributes: {
      shape: 'Rectangular flacon',
      liquidColor: 'Clear',
      capColor: 'Silver',
    },
    price: 4900000,
  },
];