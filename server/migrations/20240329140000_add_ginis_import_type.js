exports.up = async function (knex) {
    return knex('app.import_formats')
        .insert({ format: 'ginis' });
};

exports.down = async function (knex) {
    return knex('app.import_formats')
        .where('format', 'ginis')
        .delete();
};
