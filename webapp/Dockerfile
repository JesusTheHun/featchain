FROM node:12.15.0-alpine as base
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
RUN apk --no-cache upgrade && apk --no-cache add alpine-sdk python2 libtool autoconf automake git


FROM base as build
WORKDIR /app
COPY . ./

RUN yarn
RUN npm run build


FROM base as deps
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --production

FROM node:12.15.0-alpine
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY --from=deps /app/node_modules ./node_modules/
COPY --from=build /app/build ./build/
COPY env2config.js ./

EXPOSE 3000

RUN yarn global add serve
CMD node env2config.js build/config.js && serve -s build -l 3000
