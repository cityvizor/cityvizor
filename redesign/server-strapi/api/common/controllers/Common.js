const axios = require('axios');

module.exports = {
  // GET /common
  index: async ctx => {

    const configurationEntries = await strapi.services.configuration.find();
    const configuration = {};
    configurationEntries.forEach(item => {
      configuration[item.Identifier] = item.Value;
    });

    return {
      menus: {
        primary: await strapi.services.menu.findOne({ Slug: 'primary' }),
        footer: await strapi.services.menu.findOne({ Slug: 'footer' }),
      },
      pages: await strapi.services.page.find(),
      configuration,
    };
  },
  // GET /citysearch
  citysearch: async ctx => {
    const params = ctx.request.query;
    const Identifier = 'apiBaseUrl';  // option identifier references column value on configuration document
    const apiBaseUrl = await strapi.services.configuration.findOne({ Identifier });

    if (!apiBaseUrl) {
      ctx.response.badRequest(`apiBaseUrl is not configured (there should be Configuration with Identifier ${Identifier})`);
    }

    const { data } = await axios.get(
      apiBaseUrl.Value,
      {
        params: {
          query: params.query
        }
      }
    ).catch(() => {
      ctx.response.badRequest(`Request could not be resolved correctly`);
    });

    return data;
  }
};
