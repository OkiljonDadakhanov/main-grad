# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_UNIVERSITY_DASHBOARD_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ARG NEXT_PUBLIC_ENABLE_LOGGING=false
RUN test -n "$NEXT_PUBLIC_BASE_URL" \
 && test -n "$NEXT_PUBLIC_UNIVERSITY_DASHBOARD_URL" \
 && test -n "$NEXT_PUBLIC_SITE_URL" \
 && test -n "$NEXT_PUBLIC_GOOGLE_CLIENT_ID" \
 && case "$NEXT_PUBLIC_BASE_URL$NEXT_PUBLIC_UNIVERSITY_DASHBOARD_URL$NEXT_PUBLIC_SITE_URL" in *localhost*) exit 1;; esac
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_UNIVERSITY_DASHBOARD_URL=$NEXT_PUBLIC_UNIVERSITY_DASHBOARD_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_PUBLIC_ENABLE_LOGGING=$NEXT_PUBLIC_ENABLE_LOGGING
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NODE_OPTIONS=--max-old-space-size=384

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]

