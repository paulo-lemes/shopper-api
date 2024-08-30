FROM node:18-alpine AS build
WORKDIR /shopper-api
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
RUN ls -l /shopper-api
FROM node:18-alpine AS production
WORKDIR /shopper-api
COPY --from=build /shopper-api/node_modules ./node_modules
COPY --from=build /shopper-api/dist ./dist
COPY --from=build /shopper-api/package.json ./package.json
EXPOSE 3333
CMD ["npm", "run", "start"]