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

## Logic Details
Hook `useCalculatorStats` bertanggung jawab untuk instant feedback di UI.
-   **Results**: `Math.floor(adSpend / cpr)` (jika CPR > 0)
-   **Revenue**: `results * aov`
-   **Profit**: `revenue - adSpend`
-   **ROI**: `(profit / adSpend) * 100`
-   **Margin Per Result**: `aov - cpr`
