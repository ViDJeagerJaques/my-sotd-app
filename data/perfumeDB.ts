// data/perfumeDB.ts
import { PerfumeEntry } from "./types";
import { jpgDB } from "./jpg";
import { lvDB } from "./lv";
import { afnanPerfumes } from "./afnan";
import { mykonosPerfumes } from "./mykonos";
import { saffCoPerfumes } from "./saff";
import { yvesSaintLaurentPerfumes } from "./ysl";
import { velixirPerfumes } from "./velixir";
import { hmnsPerfumes } from "./hmns";
import { creedPerfumes } from "./creed";
import { versaceErosPerfumes } from "./versace";
// Gabungin semua brand di sini
export const allPerfumes: PerfumeEntry[] = [
  ...jpgDB,
  ...lvDB,
  ...afnanPerfumes,
  ...mykonosPerfumes,
  ...saffCoPerfumes,
  ...yvesSaintLaurentPerfumes,
  ...velixirPerfumes,
  ...hmnsPerfumes,
  ...creedPerfumes,
  ...versaceErosPerfumes, 
];