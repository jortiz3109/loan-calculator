# Loan calculator

A Vue 3 web application for calculating and analyzing the total cost of a bank credit/loan. Enter the credit amount, number of installments, monthly interest rate, and optionally the installment amount to get a detailed breakdown including a full amortization schedule.

## Features

- Calculates monthly installment using the annuity formula
- Supports optional installment amount to compute administrative fees
- Displays monthly effective rate (TEM), annual effective rate (TEA), and nominal annual rate (TNA)
- Shows total interest paid, total rate, and cost level badge (Low / Moderate / High)
- Full month-by-month amortization table with interest, capital, and admin fee breakdown
- Live thousands-separator formatting on COP amount fields as the user types (e.g. `5.000.000`)
- Input validation with [Zod](https://zod.dev/)
- COP (Colombian Peso) currency formatting

## Tech Stack

- [Vue 3](https://vuejs.org/) with `<script setup>` and TypeScript
- [Vite](https://vitejs.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/) + [DaisyUI v5](https://daisyui.com/)
- [Zod](https://zod.dev/) for schema validation
- [Vitest](https://vitest.dev/) + [@vue/test-utils](https://test-utils.vuejs.org/) for unit testing

## Prerequisites

- Node.js 22+
- npm

## Installation

```bash
npm install
```

## Usage

### Development server

```bash
npm run dev
# or
task dev
```

### Production build

```bash
npm run build
# or
task build
```

### Preview production build

```bash
npm run preview
```

## Testing

Run the test suite once:

```bash
npm run test:run
# or
task test
```

Run in watch mode:

```bash
npm test
```

Run with coverage report:

```bash
npm run test:coverage
# or
task test:coverage
```

Coverage is collected from all `src/**/*.{ts,vue}` files using V8.

## Project Structure

```
src/
├── components/
│   ├── CreditCalculator.vue   # Main form and results card
│   └── AmortizationTable.vue  # Month-by-month amortization table
├── composables/
│   └── useCurrencyFormat.ts   # COP currency formatting helpers
├── schemas/
│   └── creditFormSchema.ts    # Zod validation schema
├── types.d.ts                 # Global TypeScript interfaces
└── main.ts
```

## Docker

The image accepts a `BASE` build argument that sets the Vite `--base` path (defaults to `/`).

Build and run the production image locally:

```bash
docker build -t simulador-credito .
docker run -p 8080:80 simulador-credito
```

To serve the app from a sub-path (e.g. `/loan-calculator`):

```bash
docker build --build-arg BASE=/loan-calculator -t simulador-credito .
```

## Deployment

The project includes a [Taskfile](https://taskfile.dev). Before deploying, set the `OWNER` variable in `Taskfile.yml` to your GitHub username.

```bash
task docker:login              # Authenticate with GitHub Container Registry
task docker:build              # Build the image (BASE=/ by default)
task docker:build BASE=/path   # Build with a custom base path
task docker:push               # Push to GHCR
```
