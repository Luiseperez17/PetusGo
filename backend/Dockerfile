FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
# tsx es dependencia de runtime (el proyecto se ejecuta sin paso de compilación)
RUN npm ci --omit=dev

COPY tsconfig.json ./
COPY src ./src

USER node
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD wget -qO- http://127.0.0.1:${PORT:-3001}/api/health || exit 1
CMD ["npx", "tsx", "src/index.ts"]
