# ---- Base ----
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl

# ---- Dependencies ----
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

# ---- Build ----
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js in standalone mode
RUN npm run build

# ---- Production ----
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV DATA_DIR=/app/data



# Copy public assets (skills templates, imports, outputs — writable at runtime)
COPY --from=builder /app/public ./public

# Copy standalone server output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy Prisma schema + client for runtime (db push + client usage)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma

# Copy startup script (strip Windows CRLF line endings)
COPY --from=builder /app/start.sh ./start.sh
RUN sed -i 's/\r$//' ./start.sh && chmod +x ./start.sh

# Create writable directories for runtime data
RUN mkdir -p /app/data /app/public/outputs /app/public/imports /app/public/skills

EXPOSE 3000

# Use startup script (handles DB init + starts server)
CMD ["sh", "start.sh"]

