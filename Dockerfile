# 1. Pakai mesin Node 20 yang bersih dan stabil
FROM node:20-alpine

# 2. Bikin folder khusus di dalam mesin Google
WORKDIR /app

# 3. Masukkan buku panduan library
COPY package*.json ./

# 4. Install semua library (tanpa banyak tanya)
RUN npm install

# 5. Masukkan seluruh sisa kodingan web kamu
COPY . .

# 6. Rakit paksa! (Abaikan warning)
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 7. Buka jalur komunikasi
EXPOSE 3000

# 8. Nyalakan mesinnya!
CMD ["npm", "run", "start"]