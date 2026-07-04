FROM oven/bun:1-alpine
WORKDIR /app

COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# Variables de entorno para producción
ENV HOST=0.0.0.0
ENV PORT=4321
NODE_ENV=production

EXPOSE 4321

CMD ["bun", "./dist/server/entry.mjs"]
