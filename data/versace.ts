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

export const versaceErosPerfumes: PerfumeEntry[] = [
  {
    id: 52180,
    brand: 'Versace',
    name: 'Eros Flame',
    img: 'https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.52180.avif',
    spl: 9,
    period: 'Evening',
    weather: 'Dingin',
    topNotes: 'Mandarin Orange, Madagascar Pepper, Lemon, Chinotto, Rosemary',
    middleNotes: 'Geranium, Rose, Pepperwood',
    baseNotes: 'Vanilla, Tonka Bean, Sandalwood, Texas Cedar, Patchouli, Oakmoss',
    category: 'BOLD',
    notes: ['Mandarin Orange', 'Madagascar Pepper', 'Lemon', 'Chinotto', 'Rosemary', 'Geranium', 'Rose', 'Pepperwood', 'Vanilla', 'Tonka Bean', 'Sandalwood', 'Texas Cedar', 'Patchouli', 'Oakmoss'],
    physicalAttributes: {
      shape: 'Square Medusa bottle',
      liquidColor: 'Clear',
      capColor: 'Red',
    },
    price: 1350000,
  },
  {
    id: 16657,
    brand: 'Versace',
    name: 'Eros',
    img: 'https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.16657.avif',
    spl: 9,
    period: 'Day to night',
    weather: 'Versatile',
    topNotes: 'Mint, Green Apple, Lemon',
    middleNotes: 'Tonka Bean, Ambroxan, Geranium',
    baseNotes: 'Madagascar Vanilla, Virginian Cedar, Atlas Cedar, Vetiver, Oakmoss',
    category: 'GOURMAND',
    notes: ['Mint', 'Green Apple', 'Lemon', 'Tonka Bean', 'Ambroxan', 'Geranium', 'Madagascar Vanilla', 'Virginian Cedar', 'Atlas Cedar', 'Vetiver', 'Oakmoss'],
    physicalAttributes: {
      shape: 'Square Medusa bottle',
      liquidColor: 'Clear',
      capColor: 'Turquoise blue',
    },
    price: 1250000,
  },
  {
    id: 62762,
    brand: 'Versace',
    name: 'Eros Eau de Parfum',
    img: 'https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.62762.avif',
    spl: 9,
    period: 'Evening',
    weather: 'Dingin',
    topNotes: 'Mint, Candy Apple, Lemon, Mandarin Orange',
    middleNotes: 'Ambroxan, Geranium, Clary Sage',
    baseNotes: 'Vanilla, Cedar, Sandalwood, Bitter Orange, Patchouli, Leather',
    category: 'BOLD',
    notes: ['Mint', 'Candy Apple', 'Lemon', 'Mandarin Orange', 'Ambroxan', 'Geranium', 'Clary Sage', 'Vanilla', 'Cedar', 'Sandalwood', 'Bitter Orange', 'Patchouli', 'Leather'],
    physicalAttributes: {
      shape: 'Square Medusa bottle',
      liquidColor: 'Clear',
      capColor: 'Deep blue',
    },
    price: 1450000,
  },
];