FROM node:22-alpine

WORKDIR /app

# Install dependencies first (Docker layer cache)
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Create logs directory
RUN mkdir -p logs

EXPOSE 5000

CMD ["node", "server.js"]
