SECURITY.md — Security Patterns & Checklist
AUTH SETUP (NextAuth v5)
// lib/auth.ts

import NextAuth from "next-auth";

import { PrismaAdapter } from "@auth/prisma-adapter";

import Credentials from "next-auth/providers/credentials";

import Google from "next-auth/providers/google";

import { db } from "@/lib/db";

import bcrypt from "bcryptjs";

import { z } from "zod";

export const { handlers, auth, signIn, signOut } = NextAuth({

  adapter: PrismaAdapter(db),

  session: { strategy: "jwt" },

  pages: {

    signIn: "/login",

    error: "/login",

  },

  callbacks: {

    async jwt({ token, user }) {

      if (user) {

        token.role = user.role;

        token.id = user.id;

      }

      return token;

    },

    async session({ session, token }) {

      if (token) {

        session.user.role = token.role;

        session.user.id = token.id;

      }

      return session;

    },

  },

  providers: [

    Google({

      clientId: process.env.GOOGLE_CLIENT_ID!,

      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,

    }),

    Credentials({

      async authorize(credentials) {

        const parsed = z.object({

          email: z.string().email(),

          password: z.string().min(8),

        }).safeParse(credentials);

        if (!parsed.success) return null;

        const user = await db.user.findUnique({

          where: { email: parsed.data.email },

        });

        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(parsed.data.password, user.password);

        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name, role: user.role };

      },

    }),

  ],

});


ENVIRONMENT VARIABLES
# .env.local — NEVER commit this file

DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce_db"

NEXTAUTH_URL="http://localhost:3000"

NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"

# OAuth

GOOGLE_CLIENT_ID=""

GOOGLE_CLIENT_SECRET=""

# File uploads

UPLOADTHING_SECRET=""

UPLOADTHING_APP_ID=""

# Or Cloudinary

CLOUDINARY_CLOUD_NAME=""

CLOUDINARY_API_KEY=""

CLOUDINARY_API_SECRET=""

# Optional: Rate limiting

UPSTASH_REDIS_REST_URL=""

UPSTASH_REDIS_REST_TOKEN=""

// lib/env.ts — Validates all env vars on startup

import { createEnv } from "@t3-oss/env-nextjs";

import { z } from "zod";

export const env = createEnv({

  server: {

    DATABASE_URL: z.string().url(),

    NEXTAUTH_SECRET: z.string().min(32),

    NEXTAUTH_URL: z.string().url(),

  },

  client: {

    NEXT_PUBLIC_APP_URL: z.string().url(),

  },

  runtimeEnv: {

    DATABASE_URL: process.env.DATABASE_URL,

    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,

    NEXTAUTH_URL: process.env.NEXTAUTH_URL,

    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,

  },

});


PRISMA SCHEMA (Core Models)
// prisma/schema.prisma

generator client {

  provider = "prisma-client-js"

}

datasource db {

  provider = "postgresql"

  url      = env("DATABASE_URL")

}

enum Role {

  SUPER_ADMIN

  ADMIN

  EDITOR

  VIEWER

}

enum OrderStatus {

  PENDING

  CONFIRMED

  PROCESSING

  SHIPPED

  DELIVERED

  REFUNDED

  CANCELLED

}

model User {

  id            String    @id @default(cuid())

  email         String    @unique

  emailVerified DateTime?

  name          String?

  password      String?

  image         String?

  role          Role      @default(VIEWER)

  createdAt     DateTime  @default(now())

  updatedAt     DateTime  @updatedAt

  accounts      Account[]

  sessions      Session[]

}

model Product {

  id             String    @id @default(cuid())

  name           String

  slug           String    @unique

  description    String?

  price          Decimal   @db.Decimal(10, 2)

  compareAtPrice Decimal?  @db.Decimal(10, 2)

  stock          Int       @default(0)

  sku            String?   @unique

  images         String[]

  status         String    @default("draft") // draft | active | archived

  categoryId     String?

  category       Category? @relation(fields: [categoryId], references: [id])

  tags           String[]

  seoTitle       String?

  seoDescription String?

  createdAt      DateTime  @default(now())

  updatedAt      DateTime  @updatedAt

  orderItems     OrderItem[]

}

model Category {

  id        String    @id @default(cuid())

  name      String

  slug      String    @unique

  image     String?

  parentId  String?

  parent    Category? @relation("CategoryChildren", fields: [parentId], references: [id])

  children  Category[] @relation("CategoryChildren")

  products  Product[]

  createdAt DateTime  @default(now())

}

model Order {

  id         String      @id @default(cuid())

  orderNumber String     @unique

  status     OrderStatus @default(PENDING)

  total      Decimal     @db.Decimal(10, 2)

  items      OrderItem[]

  customer   Customer?   @relation(fields: [customerId], references: [id])

  customerId String?

  notes      String?

  createdAt  DateTime    @default(now())

  updatedAt  DateTime    @updatedAt

}

model OrderItem {

  id        String  @id @default(cuid())

  orderId   String

  order     Order   @relation(fields: [orderId], references: [id])

  productId String

  product   Product @relation(fields: [productId], references: [id])

  quantity  Int

  price     Decimal @db.Decimal(10, 2)

}

model Customer {

  id        String   @id @default(cuid())

  email     String   @unique

  name      String?

  phone     String?

  orders    Order[]

  createdAt DateTime @default(now())

}

// NextAuth required models

model Account {

  id                String  @id @default(cuid())

  userId            String

  type              String

  provider          String

  providerAccountId String

  refresh_token     String? @db.Text

  access_token      String? @db.Text

  expires_at        Int?

  token_type        String?

  scope             String?

  id_token          String? @db.Text

  session_state     String?

  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])

}

model Session {

  id           String   @id @default(cuid())

  sessionToken String   @unique

  userId       String

  expires      DateTime

  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

}


SECURITY CHECKLIST
Before shipping any feature, verify:
Authentication
All /dashboard/* routes protected by middleware
Login page has rate limiting (max 5 attempts / 15 min)
Passwords hashed with bcrypt (cost factor ≥ 12)
JWT tokens expire in 24 hours
Session invalidated on logout
Authorization
Every Server Action checks session.user.role
Every API route checks auth before any DB query
File uploads validate file type + size server-side
Admin-only actions reject EDITOR/VIEWER roles
Input Validation
All form data validated with Zod before DB write
URL params sanitized before DB queries
File names sanitized before storage
Rich text sanitized to prevent XSS (use DOMPurify or server-side)
Data
No sensitive data in client-side state or localStorage
Pagination enforced on all list queries (max 100 items)
Soft delete over hard delete for orders/customers
Database backups configured
Headers & Config
Security headers set in next.config.ts
.env.local in .gitignore
No API keys in client bundle (check with bundle analyzer)
CORS configured if using external API consumers
Deployment
Environment variables set in production (not just .env)
Database connection pooling (PgBouncer or Prisma Accelerate)
Error tracking (Sentry) configured
Uptime monitoring configured

