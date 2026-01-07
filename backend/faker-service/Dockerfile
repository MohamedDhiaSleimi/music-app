# Simple faker seeder image
FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --production
COPY . .
ENV PORT=4002
EXPOSE 4002
CMD ["npm", "start"]
