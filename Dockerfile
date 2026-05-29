# Stage 1: deps
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generate Prisma client (no DB needed at build time)
RUN npx prisma generate
# Build Next.js app
RUN npm run build

# Stage 3: runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Create data directory for SQLite volume
RUN mkdir -p /app/data

# Copy necessary files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public

# Expose port (overridable via PORT env var)
EXPOSE ${PORT}

# Run migrations then start the app
CMD sh -c "DATABASE_URL=${DATABASE_URL} npx prisma migrate deploy && npm start -- --port ${PORT}"
