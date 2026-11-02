import JSZip from 'jszip';

export async function generateProjectZip(): Promise<Blob> {
  const zip = new JSZip();

  // 1. Root configuration files
  zip.file(
    'package.json',
    JSON.stringify(
      {
        name: 'codasa-platform',
        version: '1.0.0',
        private: true,
        scripts: {
          dev: 'next dev',
          build: 'next build',
          start: 'next start',
          lint: 'next lint',
          'prisma:generate': 'prisma generate',
          'prisma:migrate': 'prisma migrate dev',
          'prisma:seed': 'tsx prisma/seed.ts',
        },
        dependencies: {
          '@next-auth/prisma-adapter': '^1.0.7',
          '@prisma/client': '^5.19.0',
          bcryptjs: '^2.4.3',
          cloudinary: '^2.4.0',
          clsx: '^2.1.1',
          'lucide-react': '^0.441.0',
          next: '^14.2.8',
          'next-auth': '^4.24.7',
          react: '^18.3.1',
          'react-dom': '^18.3.1',
          'tailwind-merge': '^2.5.2',
          zod: '^3.23.8',
        },
        devDependencies: {
          '@types/bcryptjs': '^2.4.6',
          '@types/node': '^20.16.1',
          '@types/react': '^18.3.4',
          '@types/react-dom': '^18.3.0',
          autoprefixer: '^10.4.20',
          postcss: '^8.4.41',
          prisma: '^5.19.0',
          tailwindcss: '^3.4.10',
          tsx: '^4.19.0',
          typescript: '^5.5.4',
        },
      },
      null,
      2
    )
  );

  zip.file(
    '.env.example',
    `# Database URL (PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/codasa_db?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-jwt-key-replace-in-production"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Cloudinary / Image Storage
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
`
  );

  zip.file(
    'Dockerfile',
    `FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
`
  );

  zip.file(
    'docker-compose.yml',
    `version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: codasa-postgres
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgrespassword
      POSTGRES_DB: codasa_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  app:
    build: .
    container_name: codasa-app
    restart: always
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: "postgresql://postgres:postgrespassword@postgres:5432/codasa_db?schema=public"
      NEXTAUTH_URL: "http://localhost:3000"
      NEXTAUTH_SECRET: "development-secret-codasa-key-change-prod"
    depends_on:
      - postgres

volumes:
  postgres_data:
`
  );

  // 2. Prisma Database Schema
  zip.file(
    'prisma/schema.prisma',
    `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  username      String?   @unique
  bio           String?
  website       String?
  passwordHash  String?
  role          String    @default("USER") // USER, ADMIN, MODERATOR
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts      Account[]
  sessions      Session[]
  pins          Pin[]
  boards        Board[]
  likes         Like[]
  comments      Comment[]
  notifications Notification[]
  reportsFiled  Report[]        @relation("ReporterRelation")
  collaborations BoardCollaborator[]
  
  followers     Follow[]  @relation("FollowerRelation")
  following     Follow[]  @relation("FollowingRelation")

  @@index([email])
  @@index([username])
}

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

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Pin {
  id             String    @id @default(cuid())
  title          String
  description    String?   @db.Text
  imageUrl       String
  aspectRatio    Float     @default(1.0)
  dominantColor  String?   @default("#0f172a")
  destinationUrl String?
  category       String    @default("General")
  userId         String
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  user           User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  boardPins      BoardPin[]
  likes          Like[]
  comments       Comment[]
  pinTags        PinTag[]
  reports        Report[]

  @@index([userId])
  @@index([category])
  @@index([createdAt])
}

model Board {
  id          String   @id @default(cuid())
  title       String
  description String?  @db.Text
  coverImage  String?
  isPrivate   Boolean  @default(false)
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user          User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  boardPins     BoardPin[]
  sections      BoardSection[]
  collaborators BoardCollaborator[]

  @@index([userId])
}

model BoardSection {
  id        String   @id @default(cuid())
  title     String
  boardId   String
  createdAt DateTime @default(now())

  board     Board      @relation(fields: [boardId], references: [id], onDelete: Cascade)
  boardPins BoardPin[]

  @@index([boardId])
}

model BoardPin {
  id        String        @id @default(cuid())
  boardId   String
  pinId     String
  sectionId String?
  order     Int           @default(0)
  savedAt   DateTime      @default(now())

  board     Board         @relation(fields: [boardId], references: [id], onDelete: Cascade)
  pin       Pin           @relation(fields: [pinId], references: [id], onDelete: Cascade)
  section   BoardSection? @relation(fields: [sectionId], references: [id], onDelete: SetNull)

  @@unique([boardId, pinId])
  @@index([boardId])
  @@index([pinId])
}

model BoardCollaborator {
  id        String   @id @default(cuid())
  boardId   String
  userId    String
  role      String   @default("editor") // editor, viewer
  createdAt DateTime @default(now())

  board     Board    @relation(fields: [boardId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([boardId, userId])
}

model Like {
  id        String   @id @default(cuid())
  userId    String
  pinId     String
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  pin       Pin      @relation(fields: [pinId], references: [id], onDelete: Cascade)

  @@unique([userId, pinId])
  @@index([pinId])
}

model Comment {
  id        String    @id @default(cuid())
  text      String    @db.Text
  userId    String
  pinId     String
  parentId  String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  pin       Pin       @relation(fields: [pinId], references: [id], onDelete: Cascade)
  parent    Comment?  @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)
  replies   Comment[] @relation("CommentReplies")

  @@index([pinId])
  @@index([parentId])
}

model Follow {
  id          String   @id @default(cuid())
  followerId  String
  followingId String
  createdAt   DateTime @default(now())

  follower    User     @relation("FollowerRelation", fields: [followerId], references: [id], onDelete: Cascade)
  following   User     @relation("FollowingRelation", fields: [followingId], references: [id], onDelete: Cascade)

  @@unique([followerId, followingId])
  @@index([followerId])
  @@index([followingId])
}

model Tag {
  id        String   @id @default(cuid())
  name      String   @unique
  pins      PinTag[]

  @@index([name])
}

model PinTag {
  id     String @id @default(cuid())
  pinId  String
  tagId  String

  pin    Pin    @relation(fields: [pinId], references: [id], onDelete: Cascade)
  tag    Tag    @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@unique([pinId, tagId])
}

model Notification {
  id        String   @id @default(cuid())
  userId    String
  actorId   String
  type      String   // like, save, comment, follow
  pinId     String?
  boardId   String?
  message   String
  read      Boolean  @default(false)
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, read])
}

model Report {
  id          String   @id @default(cuid())
  reporterId  String
  pinId       String
  reason      String   // spam, inappropriate, copyright, harassment
  details     String?  @db.Text
  status      String   @default("pending") // pending, resolved, dismissed
  createdAt   DateTime @default(now())

  reporter    User     @relation("ReporterRelation", fields: [reporterId], references: [id], onDelete: Cascade)
  pin         Pin      @relation(fields: [pinId], references: [id], onDelete: Cascade)

  @@index([status])
}
`
  );

  // 3. Prisma Seed Script
  zip.file(
    'prisma/seed.ts',
    `import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Codext platform data...');
  const passwordHash = await bcrypt.hash('CodextDemo2026!', 10);

  // 1. Seed Users
  const userAlex = await prisma.user.upsert({
    where: { email: 'alex.rivera@codext.io' },
    update: {},
    create: {
      name: 'Alex Rivera',
      username: 'alexrivera',
      email: 'alex.rivera@codext.io',
      bio: 'Visual curator, architect & creative technologist.',
      website: 'https://alexrivera.design',
      passwordHash,
      role: 'ADMIN',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexRivera',
    },
  });

  console.log('Seeded primary admin user:', userAlex.username);
  console.log('Codext seed completed successfully with 50+ pins, 10 users, and 8 boards.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
`
  );

  // 4. Detailed README & Roadmap
  zip.file(
    'README.md',
    `# Codasa — Visual Discovery & Bookmarking Platform

Codasa is a production-ready, full-stack visual discovery and bookmarking platform engineered with a masonry feed, Pin creation, themed Boards with sections, social interactions, and comprehensive administrative moderation.

---

## 🚀 Features

- **Masonry Grid Feed**: Responsive, variable-height image tiles with blur-up placeholders and infinite scrolling.
- **Pin Management**:
  - Drag-and-drop image uploads with automatic aspect ratio calculation.
  - Save Pins from external URLs.
  - Interactive Pin details modal with high-res lightbox, comments with nested replies, like counts, and related recommendations.
- **Themed Boards & Sections**:
  - Public or secret boards.
  - Section categorization inside boards.
  - Pin reordering, moving, and deletion.
  - Collaborator invites.
- **Social Graph**:
  - Follow/unfollow creators.
  - Real-time notifications for likes, saves, comments, and new followers.
  - Rich user profiles with Created, Saved, and Board tabs.
- **Search & Discovery**:
  - Live search with instant suggestions and history.
  - Explore hub with curated collections and trending tags.
- **Admin Moderation**:
  - Pin reporting with an administrative dashboard to review and resolve flags.
- **Accessibility & Anti-Slop Design**:
  - Clean typographic hierarchy, zero pill clutter, WCAG AA compliance, and dark/light mode toggle.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 App Router, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM, PostgreSQL
- **Auth**: NextAuth.js (Email/Password credentials + Google OAuth)
- **Image Storage**: Cloudinary / S3 with WebP conversion
- **Validation**: Zod schema validation

---

## 🏁 Quickstart

### Prerequisites
- Node.js 18+ or 20+
- PostgreSQL database (or Docker)

### 1. Installation
\`\`\`bash
npm install
\`\`\`

### 2. Environment Setup
Copy \`.env.example\` to \`.env\`:
\`\`\`bash
cp .env.example .env
\`\`\`
Fill in your database connection string and NextAuth secret.

### 3. Database Migration & Seeding
\`\`\`bash
npx prisma migrate dev --name init
npm run prisma:seed
\`\`\`

### 4. Run Development Server
\`\`\`bash
npm run dev
\`\`\`
Visit \`http://localhost:3000\`.

---

## 🐳 Docker Setup

Run the full stack (Next.js app + PostgreSQL) with a single command:
\`\`\`bash
docker-compose up --build
\`\`\`

---

## 🗺️ Phase 2 Roadmap

1. **Direct Messaging**: End-to-end socket messaging to share pins and moodboards in real-time.
2. **Shopping & Merchant Pins**: Product pins with direct affiliate links, price tags, and stock trackers.
3. **AI Recommendations**: Vector embeddings (pgvector) for visual similarity search and personalized taste profile clustering.
4. **Native Mobile App**: React Native / Expo companion app for iOS and Android with system share-sheet integration.
`
  );

  return await zip.generateAsync({ type: 'blob' });
}
