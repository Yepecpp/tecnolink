FROM node:20.11.1-alpine AS node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
RUN chmod +x entry.sh
ENTRYPOINT ["./entry.sh"]

EXPOSE 3000
EXPOSE 80