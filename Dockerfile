FROM oven/bun:1.1.30

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY . .

EXPOSE 5000
CMD ["bun", "run", "src/index.ts"]