# Calculate Module Documentation

## Overview
Modul Calculate memungkinkan User untuk mensimulasikan dan melacak performance campaign iklan. Modul ini mencakup kalkulator untuk memproyeksikan ROI, Profit, dan metrik lainnya berdasarkan Ad Spend, CPR, dan AOV. Modul ini juga terintegrasi dengan AI untuk analisis dan menyimpan history perhitungan.

## Key Components

### Views
-   **CalculatorPage.tsx**: Interface utama.
    -   Input: Ad Spend, Cost Per Result (CPR), Average Order Value (AOV), Product Price.
    -   Output: ROI, Profit, Revenue, dll.
    -   Actions: Calculate AI Analysis, Save Calculation.
-   **TableCaclulator.tsx**: Menampilkan history perhitungan yang disimpan dalam format Table.

### Hooks
-   **useCalculatorStats.ts**: Berisi business logic inti untuk kalkulator.
    -   `results = adSpend / cpr`
    -   `revenue = results * aov`
    -   `profit = revenue - adSpend`
    -   `roi = (profit / adSpend) * 100`

## Calculation Flow

```mermaid
sequenceDiagram
    participant User
    participant Page as CalculatorPage
    participant Hook as useCalculatorStats
    participant API as Backend API
    participant AI as AI Service

    User->>Page: Input (Ad Spend, CPR, AOV)
    Page->>Hook: useCalculatorStats(inputs)
    Hook-->>Page: Return { ROI, Profit, Revenue... }
    Page->>User: Display Stats

    alt Save Calculation
        User->>Page: Click "Save"
        Page->>API: POST /api/calculations
        API-->>Page: Success
        Page->>User: "Saved Successfully"
    end

    alt Analyze AI
        User->>Page: Click "Analyze with AI"
        Page->>AI: POST /api/ai/analyze (stats)
        AI-->>Page: Analysis Result
        Page->>User: Display AI Insights
    end
```

## Logic Details: Rumus Perhitungan
Hook `useCalculatorStats` bertanggung jawab untuk memberikan umpan balik instan di UI. Berikut adalah penjelasan rinci dari setiap rumus yang digunakan:

### 1. Results (Estimasi Hasil)
Jumlah hasil (konversi/penjualan) yang didapat dari biaya iklan.
-   **Rumus**: `Results = Ad Spend / CPR`
-   **Logika**: Membagi total anggaran iklan (`Ad Spend`) dengan biaya per hasil (`CPR`). Jika CPR bernilai 0, maka Results adalah 0. Hasil dibulatkan ke bawah (`Math.floor`) untuk mendapatkan angka bulat.

### 2. Revenue (Pendapatan Kotor)
Total pendapatan yang dihasilkan dari kampanye.
-   **Rumus**: `Revenue = Results * AOV`
-   **Logika**: Mengalikan jumlah `Results` yang didapat dengan rata-rata nilai pesanan (`AOV`).

### 3. Profit (Keuntungan Bersih)
Keuntungan bersih setelah dikurangi biaya iklan (namun belum termasuk COGS produk di rumus ini, asumsi margin produk sudah diperhitungkan dalam AOV atau dipisah).
-   **Rumus**: `Profit = Revenue - Ad Spend`
-   **Logika**: Mengurangi total pendapatan (`Revenue`) dengan biaya yang dikeluarkan untuk iklan (`Ad Spend`).

### 4. ROI (Return on Investment)
Persentase pengembalian investasi iklan.
-   **Rumus**: `ROI = (Profit / Ad Spend) * 100`
-   **Logika**: Mengukur efisiensi kampanye. Menghitung rasio keuntungan (`Profit`) terhadap biaya (`Ad Spend`) dalam bentuk persen.

### 5. Margin Per Result
Selisih antara nilai pesanan dan biaya untuk mendapatkan satu pesanan tersebut.
-   **Rumus**: `Margin = AOV - CPR`
-   **Logika**: Menunjukkan berapa banyak sisa uang dari setiap penjualan setelah dikurangi biaya iklan per penjualan tersebut.

### 6. CPR Target
Target biaya per hasil yang disarankan untuk menjaga profitabilitas (Rule of Thumb: 30% dari harga produk).
-   **Rumus**: `CPR Target = Product Price * 0.3`

## Google AI Mechanism
Fitur "Analyze with AI" menggunakan power dari **Google Gemini 2.0 Flash** untuk memberikan wawasan strategis.

### 1. Model Configuration
-   **Model**: `gemini-2.0-flash`
-   **Temperature**: `0.7` (Kreatif namun tetap konsisten)
-   **Format**: `application/json` (Structured Output)

### 2. Prompt Engineering Logic
Sistem mengirimkan prompt dengan persona **"Elite Digital Marketing Strategist"** dengan pengalaman 15 tahun.
-   **Input Data**: API mengirimkan data `Ad Spend`, `CPR`, `AOV`, `Profit`, dan `ROI` yang sudah diformat ke mata uang IDR.
-   **Analisis Rule-based**:
    -   Jika **ROI Negatif**: AI diinstruksikan fokus pada penurunan CPR atau kenaikan AOV (Fixing Phase).
    -   Jika **ROI Positif (>20%)**: AI fokus pada strategi untuk menaikkan budget (Scaling Phase).
-   **Output Structure**:
    -   `health_score` (0-100): Skor kesehatan kampanye.
    -   `risk_level`: Tingkat risiko (Low/Medium/High).
    -   `action_plan`: Array rekomendasi tindakan konkret (Scaling/Fixing/Kill/Optimization).

### 3. API Flow
1.  Frontend mengirim payload `{ adSpend, cpr, aov, roi, profit }` ke `/api/ai/analyze`.
2.  Backend memvalidasi sesi user (`withAuth`).
3.  Backend menyusun prompt dinamis dan memanggil Google GenAI SDK.
4.  Gemini mengembalikan respons JSON.
5.  Frontend menampilkan hasil analisis dalam bentuk Score Card dan Action List.
