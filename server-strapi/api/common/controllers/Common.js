const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  // GET /common
  index: async ctx => {
    const entities = {
      menus: {
        primary: await strapi.services.menu.find({ Slug: 'primary' }),
        footer: await strapi.services.menu.find({ Slug: 'footer' }),
      },
      pages: await strapi.services.page.find()
    };

    return entities;
  },
};
