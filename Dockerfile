 # syntax=docker/dockerfile:1
 
 # ---- deps ----
 FROM node:20-alpine AS deps
 WORKDIR /app
 
 # Needed by some native deps (kept minimal)
 RUN apk add --no-cache libc6-compat
 
 COPY package.json package-lock.json ./
 RUN npm ci
 
 # ---- builder ----
 FROM node:20-alpine AS builder
 WORKDIR /app
 
 ENV NODE_ENV=production
 
 COPY --from=deps /app/node_modules ./node_modules
 COPY . .
 
 RUN npm run build
 
 # ---- runner ----
 FROM node:20-alpine AS runner
 WORKDIR /app
 
 ENV NODE_ENV=production
 ENV PORT=4000
 
 # Non-root user
 RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
 
 # Copy only what we need to run
 COPY --from=deps /app/node_modules ./node_modules
 COPY --from=builder /app/package.json ./package.json
 COPY --from=builder /app/next.config.* ./
 COPY --from=builder /app/public ./public
 COPY --from=builder /app/.next ./.next
 
 # If you use Next.js output tracing, this is ideal, but it requires next.config output: 'standalone'
 # COPY --from=builder /app/.next/standalone ./
 # COPY --from=builder /app/.next/static ./.next/static
 
 USER nextjs
 EXPOSE 4000
 
 CMD ["npm", "run", "start"]
 
