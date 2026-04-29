FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
# Install all deps (devDeps needed for sequelize-cli migrate/seed)
RUN npm ci

COPY . .
RUN npm run build

# Ensure upload directory exists
RUN mkdir -p uploads

EXPOSE 3001

# Run migrations and seeds before starting the server
CMD ["sh", "-c", "npm run migrate && npm run seed && node dist/server.js"]
