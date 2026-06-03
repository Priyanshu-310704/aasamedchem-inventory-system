# AASA MedChem

AASA MedChem is a role-based marketplace workflow for chemical products, quotations, orders, and inventory tracking.

## Architecture

```text
Next.js
  ↓
API Routes
  ↓
Prisma
  ↓
Neon PostgreSQL
```

## Stack

- Next.js 16 App Router
- Prisma 7 generated client in `prisma/generated/client`
- NextAuth v4 credentials provider
- Neon PostgreSQL
- Tailwind CSS

## Unit Storage Strategy

All stock and quotation math is converted through `src/lib/conversions.ts`.

- Weight → grams (`g`)
- Volume → milliliters (`mL`)
- Count → items (`item`)

Products always store their base unit internally as `g`, `mL`, or `item`.

## Pricing Strategy

The app stores base price per smallest unit.

Examples:

- Weight products store price per `g`
- Volume products store price per `mL`
- Count products store price per `item`

Quotation quantities are converted to base units before totals are calculated.

## Credentials

Seeded users use password `123456`.

- Admin: `admin@test.com`
- Seller: `seller@test.com`
- Buyer: `buyer@test.com`

Run:

```bash
npx prisma db seed
```

## Local Development

```bash
npm install
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
npm run dev
```

Required environment variables:

```text
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

## Deployment URL

Vercel Link: Add after deployment.

## Final Order of Execution

1. Next Setup
2. Neon
3. Prisma Schema
4. Migration
5. Auth
6. Route Protection
7. Dashboard Layouts
8. Product CRUD
9. Conversion Engine
10. Search
11. Quotation System
12. Orders
13. Inventory Tracking
14. Admin Features
15. Deployment
16. README
