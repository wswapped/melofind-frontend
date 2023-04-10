# Melofinder

The project is built with Nuxt a Vue framework

It can be run in docker or in your local system

Before running the project `.env` file should be created from `.env.example` template

In the template there are below variables that should be setup

- `API_HOST` this is the host which API is running on, default can be kept if there was no change

- `APP_NAME` The name of the app to be shown on frontend like titles

## Docker setup

run `docker-compose up` to start the frontend service

## Build Setup without docker

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out the [documentation](https://nuxtjs.org).


More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/plugins).


##  API issues

- There is no image in the artist search

- There is no release date in album info