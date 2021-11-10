# pull official base image
FROM node:14-alpine AS builder

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

ARG REACT_APP_dockerauthserver
ARG REACT_APP_dockerauctionmanagerserver
ARG REACT_APP_dockerauctiondetailsserver
ARG REACT_APP_dockercurrencymanagementserver
ARG REACT_APP_dockerauctionroomserver
ENV REACT_APP_dockerauthserver $REACT_APP_dockerauthserver
ENV REACT_APP_dockerauctionmanagerserver $REACT_APP_dockerauctionmanagerserver
ENV REACT_APP_dockerauctiondetailsserver $REACT_APP_dockerauctiondetailsserver
ENV REACT_APP_dockercurrencymanagementserver $REACT_APP_dockercurrencymanagementserver
ENV REACT_APP_dockerauctionroomserver $REACT_APP_dockerauctionroomserver

# install app dependencies
COPY package.json yarn.lock ./
COPY package.json ./
RUN yarn install --frozen-lockfile --ignore-engines
COPY . ./
RUN yarn build --ignore-engines

# add app
# COPY . ./

# start app
# CMD ["yarn", "start"]

FROM nginx:1.19-alpine AS server
COPY --from=builder ./app/build /usr/share/nginx/html