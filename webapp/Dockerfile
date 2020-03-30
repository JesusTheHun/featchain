FROM node:12.15.0-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

RUN apk --no-cache upgrade && apk --no-cache add alpine-sdk python2 libtool autoconf automake git
COPY . /app

RUN yarn
RUN npm run build


FROM node:12.15.0-alpine as deps
WORKDIR /app

RUN yarn install --production

FROM node:12.15.0-alpine
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules/
COPY --from=build /app/build ./build/
EXPOSE 4000

RUN yarn global add serve
CMD serve -s build -l 4000
