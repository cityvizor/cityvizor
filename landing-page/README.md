# Landing page

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

To connect to production server

```shell script
VUE_APP_API_BASE_URL=https://cityvizor/api/v2/service/citysearch VUE_APP_CONTENT_API_BASE_URL=https://cityvizor yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Lints and fixes files

```
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### Prod build

```shell script
VUE_APP_API_BASE_URL=https://cityvizor-api.ceskodigital.net/citysearch VUE_APP_CONTENT_API_BASE_URL=https://cityvizor-api.ceskodigital.net yarn build
```
