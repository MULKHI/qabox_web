QaBox - Standalone Build
========================

CARA MENJALANKAN:
-----------------
1. Pastikan Node.js sudah terinstall (https://nodejs.org)

2. Buka terminal di folder ini, lalu jalankan:
   npm run serve

3. Buka browser di: http://localhost:3001

CATATAN:
--------
- Pastikan API server kamu berjalan di http://localhost:3000
  sebelum mencoba login atau register.
- URL API bisa diubah dengan mengedit nilai VITE_API_BASE_URL
  sebelum build, atau langsung di file assets/index-*.js
  (cari string "http://localhost:3000").

STRUKTUR FILE:
--------------
index.html        - entry point
assets/           - JS dan CSS yang sudah diminifikasi
qabox-logo.png    - logo
package.json      - script untuk serve
