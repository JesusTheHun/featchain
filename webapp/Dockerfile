FROM node:12.15.0-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
RUN apk --no-cache upgrade && apk --no-cache add alpine-sdk python2 libtool autoconf automake git

COPY . ./

RUN yarn

ENV NODE_ENV production
RUN npm run build

FROM node:12.15.0-alpine
WORKDIR /app
RUN yarn global add serve

COPY --from=build /app/build ./build/
COPY env2config.js ./

EXPOSE 3000

CMD node env2config.js build/config.js && serve -s build -l 3000
