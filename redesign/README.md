# CityVizor redesign

Consists of two components
- Vue based client in client-redesign
- Strapi based server in server-strapi

Client does not work without being able to connect to the strapi-server, configured by `VUE_APP_CONTENT_API_BASE_URL` 
and `VUE_APP_API_BASE_URL` env variables

Moreover, to be able to search in cities, you have to set `apiBaseUrl` variable to `https://cityvizor.cesko.digital/api/v2/service/citysearch`
inside Strapi console (Configurations section).


# Deployment
To install strapi follow this [documentation](https://strapi.io/documentation/3.0.0-beta.x/guides/deployment.html#amazon-aws)



