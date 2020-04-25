const axios = require('axios');

module.exports = {
  // GET /strapi/common
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
  }
};
