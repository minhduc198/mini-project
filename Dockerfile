 # syntax=docker/dockerfile:1

 # ---- deps ----
 FROM node:22-alpine AS deps
 WORKDIR /app

 # Needed by some native deps (kept minimal)
 RUN apk add --no-cache libc6-compat

 COPY package.json package-lock.json ./
 RUN npm ci

 # ---- builder ----
 FROM node:22-alpine AS builder
 WORKDIR /app

 ARG NEXT_PUBLIC_BASE_URL
 ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
 ENV NODE_ENV=production

 COPY --from=deps /app/node_modules ./node_modules
 COPY . .

 RUN npm run build

 # ---- runner ----
 FROM node:22-alpine AS runner
 WORKDIR /app

 ARG PORT=4000
 ENV NODE_ENV=production
 ENV PORT=${PORT}

 # Non-root user
 RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

 # Copy only what we need to run
 COPY --from=deps /app/node_modules ./node_modules
 COPY --from=builder /app/package.json ./package.json
 COPY --from=builder /app/next.config.* ./
 COPY --from=builder /app/public ./public
 COPY --from=builder /app/.next ./.next

 USER nextjs
 EXPOSE ${PORT}

 CMD ["npm", "run", "start"]
 
