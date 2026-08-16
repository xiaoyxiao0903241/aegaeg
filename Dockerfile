FROM mirror.gcr.io/library/node:22-slim AS builder

WORKDIR /app

RUN corepack enable \
    && corepack prepare pnpm@11.17.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build


FROM mirror.gcr.io/library/nginx:alpine AS static-server

COPY --from=builder /app/dist/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
