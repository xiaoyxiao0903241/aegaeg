FROM mirror.gcr.io/library/node:20.19.0-slim AS builder

WORKDIR /app

RUN corepack enable \

    && corepack prepare pnpm@10.20.0 --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --no-frozen-lockfile

COPY . .

RUN pnpm run build


FROM mirror.gcr.io/library/nginx:alpine AS static-server

COPY --from=builder /app/dist/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
