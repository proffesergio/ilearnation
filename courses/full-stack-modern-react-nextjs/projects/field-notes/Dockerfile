FROM node:24-bookworm-slim
WORKDIR /app
COPY package*.json ./
COPY api/package.json api/package.json
COPY web/package.json web/package.json
COPY ssr/package.json ssr/package.json
COPY next-app/package.json next-app/package.json
RUN npm ci --omit=dev
COPY api/src api/src
USER node
ENV API_HOST=0.0.0.0 API_PORT=4000
EXPOSE 4000
CMD ["npm", "start", "--workspace=@field-notes/api"]
