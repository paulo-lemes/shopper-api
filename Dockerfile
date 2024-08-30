FROM node:18-alpine AS build
WORKDIR /shopper-api
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
FROM node:18-alpine
WORKDIR /shopper-api
COPY --from=build /shopper-api/node_modules ./node_modules
COPY --from=build /shopper-api/dist ./dist
EXPOSE 3333
CMD ["npm", "run", "start"]