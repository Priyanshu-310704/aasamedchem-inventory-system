# AASA MedChem Inventory & Order Management System

## Project Overview

This application is a role-based inventory, quotation, and order management system built using Next.js, Prisma, Neon PostgreSQL, and Vercel.

The platform allows Buyers to browse products and request quotations, Sellers to manage products and respond to quotations, and Admins to manage the overall system.

The primary goal of the system is to provide accurate inventory tracking, unit conversion, quotation generation, and order management while maintaining high precision for quantities and pricing.

---

# Features

## Authentication & Authorization

The application supports three user roles:

### Admin

* Manage all users
* Manage sellers
* View all products
* View all quotations
* View all orders
* Monitor inventory

### Seller

* Create products
* Update products
* Manage inventory
* Receive quotation requests
* Approve or reject quotations
* View orders related to their products

### Buyer

* Browse products
* Search products
* Request quotations
* Place orders
* View quotation history
* View order history

Role-based access control is enforced using NextAuth and middleware.

---

# System Architecture

```text
┌────────────────────────────┐
│        Frontend            │
│  Next.js App Router UI     │
└─────────────┬──────────────┘
              │
              ▼
┌────────────────────────────┐
│      API Routes /          │
│      Server Actions        │
└─────────────┬──────────────┘
              │
              ▼
┌────────────────────────────┐
│         Prisma ORM         │
└─────────────┬──────────────┘
              │
              ▼
┌────────────────────────────┐
│   Neon PostgreSQL Database │
└────────────────────────────┘
```

---

# Technology Stack

## Frontend

* Next.js 16
* TypeScript
* Tailwind CSS

## Backend

* Next.js API Routes
* Server Actions

## Database

* Neon PostgreSQL

## ORM

* Prisma ORM

## Authentication

* NextAuth Credentials Provider
* bcrypt password hashing

## Deployment

* Vercel

---

# Project Structure

```text
src/

├── app
│   ├── admin
│   ├── seller
│   ├── buyer
│   ├── api
│   └── auth
│
├── components
│
├── lib
│   ├── prisma.ts
│   ├── auth.ts
│   ├── conversions.ts
│   └── pricing.ts
│
├── types
│
└── middleware.ts

prisma/
├── schema.prisma
├── seed.ts
└── generated/client
```

---

# Database Design

## User

Stores authentication and role information.

```prisma
User
- id
- name
- email
- password
- role
```

---

## Product

Stores seller products and inventory information.

```prisma
Product
- id
- sellerId
- name
- sku
- description
- dimension
- baseUnit
- stockQuantity
- basePrice
```

---

## Quotation

Represents buyer quotation requests.

```prisma
Quotation
- id
- buyerId
- sellerId
- status
- totalAmount
```

---

## QuotationItem

Stores requested products within a quotation.

```prisma
QuotationItem
- id
- quotationId
- productId
- quantity
- unit
- price
```

---

## Order

Created after quotation approval.

```prisma
Order
- id
- quotationId
- status
- totalAmount
```

---

## InventoryTransaction

Tracks inventory changes.

```prisma
InventoryTransaction
- id
- productId
- quantity
- action
- createdAt
```

---

# Quantity Storage Strategy

To ensure consistency and avoid conversion errors, all quantities are stored internally using base units.

## Weight

```text
Base Unit = grams (g)
```

Examples:

```text
1 kg = 1000 g
2.5 kg = 2500 g
```

---

## Volume

```text
Base Unit = milliliters (mL)
```

Examples:

```text
1 L = 1000 mL
2.5 L = 2500 mL
```

---

## Count

```text
Base Unit = item
```

Examples:

```text
5 items = 5
```

---

# Price Storage Strategy

Prices are stored using the smallest unit for each dimension.

Examples:

```text
Rice

₹100/kg

Stored as:

₹0.1 per gram
```

```text
Acetone

₹150/L

Stored as:

₹0.15 per mL
```

Benefits:

* Consistent calculations
* Accurate pricing
* No repeated conversion logic

---

# Data Types & Precision

To support:

* Large inventory values
* High precision calculations
* Accurate pricing

The application uses:

```sql
NUMERIC(20,8)
```

for:

* Quantities
* Prices
* Totals

This avoids floating-point precision issues.

---

# Unit Conversion Strategy

All conversion logic is centralized inside:

```text
src/lib/conversions.ts
```

Example:

```ts
const WEIGHT = {
  g: 1,
  kg: 1000,
};

const VOLUME = {
  mL: 1,
  L: 1000,
};
```

Flow:

```text
User Input
     ↓
Convert To Base Unit
     ↓
Database Storage
     ↓
Price Calculation
     ↓
Convert For Display
```

---

# Quotation Workflow

## Buyer

1. Search product
2. Select quantity and unit
3. Submit quotation request

Example:

```text
Acetone
2.5 L
```

Converted to:

```text
2500 mL
```

Price calculated using base price.

---

## Seller

1. View quotation request
2. Approve or reject quotation

---

## Order Creation

Upon approval:

```text
Quotation
      ↓
Order
      ↓
Inventory Reduced
```

---

# Search Implementation

Products are searched using Prisma filters.

Example:

```ts
await prisma.product.findMany({
  where: {
    name: {
      contains: search,
      mode: "insensitive",
    },
  },
});
```

Features:

* Case-insensitive search
* Product filtering
* Seller filtering

---

# Inventory Management

Inventory is updated whenever:

* Product is created
* Stock is added
* Order is completed

All inventory changes are tracked through InventoryTransaction records.

---

# Authentication

Authentication is implemented using NextAuth.

Passwords are:

```text
Hashed → bcrypt
Stored → Database
Verified → Login
```

Roles:

```text
ADMIN
SELLER
BUYER
```

Protected routes:

```text
/admin/*
/seller/*
/buyer/*
```

---

# Environment Variables

Required variables:

```env
DATABASE_URL=

NEXTAUTH_SECRET=

NEXTAUTH_URL=
```

---

# Local Setup

Install dependencies:

```bash
npm install
```

Generate Prisma client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate deploy
```

Seed database:

```bash
npx prisma db seed
```

Start application:

```bash
npm run dev
```

---

# Test Credentials

Password:

```text
123456
```

Admin:

```text
admin@test.com
```

Seller:

```text
seller@test.com
```

Buyer:

```text
buyer@test.com
```

---

# Deployment

The application is deployed on Vercel.

Deployment process:

```bash
git push origin main
```

Vercel automatically:

1. Builds application
2. Generates Prisma client
3. Connects to Neon
4. Deploys production build

Production URL:

```text
https://your-vercel-url.vercel.app
```

---

# Future Improvements

If given additional development time, the following enhancements would be implemented:

* Advanced search filters
* Inventory alerts
* Analytics dashboard
* Email notifications
* Automated testing
* Audit logs
* Caching layer
* Full-text search
* Product categories
* Bulk product import/export

---

# Assumptions

* Buyers request quotations before placing orders.
* Sellers manage only their own products.
* Admins have full access across the platform.
* All calculations use base units internally.
* Inventory is reduced only after order approval/completion.

---

# Author

Priyanshu

Built as part of the AASA MedChem Hackathon Assignment.
