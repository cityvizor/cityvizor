exports.up = function (knex) {
    return knex.schema
        .createTable('app.sections', table => {
            table.increments('section_id').primary();
            table.string('cs_name', 50).notNullable();
            table.string('en_name', 50).notNullable();
            table.integer('order_on_landing').notNullable();
        })
        .then(() => {
            return knex('app.sections').insert([
                {
                    cs_name: 'Zapojené obce',
                    en_name: 'Participating municipalities',
                    order_on_landing: 1,
                },
            ]);
        })
        .then(() => {
            return knex.schema.alterTable('app.profiles', table => {
                table.integer('section_id').nullable();
                table
                    .foreign('section_id')
                    .references('section_id')
                    .inTable('app.sections');
            });
        })
        .then(() => {
            return knex.raw(`
                CREATE OR REPLACE VIEW public.profiles AS SELECT 
                    profiles.id,
                    profiles.status,
                    profiles.url,
                    profiles.name,
                    profiles.email,
                    profiles.avatar_type,
                    profiles.ico,
                    profiles.databox,
                    profiles.edesky,
                    profiles.mapasamospravy,
                    profiles.gps_x,
                    profiles.gps_y,
                    profiles.main,
                    profiles.type,
                    profiles.parent,
                    profiles.popup_name,
                    profiles.sum_mode,
                    profiles.pbo_category_id,
                    profiles.section_id
                FROM app.profiles`);
        })
        .then(() => { // update existing profiles so landing page displays the same set of profiles as before this migration
            return knex.raw(`
              UPDATE app.profiles
                SET section_id = 1
                WHERE parent IS NULL
                AND (status = 'visible' OR status = 'pending')
                AND type = 'municipality'
            `);
          })
        .then(() => {
            return knex.raw(`
            UPDATE app.profiles
              SET status = 'pending'
              WHERE status = 'preview'
            `)
        });
};

exports.down = function (knex) {
    return knex
        .raw(
            `CREATE OR REPLACE VIEW public.profiles AS SELECT 
                profiles.id,
                profiles.status,
                profiles.url,
                profiles.name,
                profiles.email,
                profiles.avatar_type,
                profiles.ico,
                profiles.databox,
                profiles.edesky,
                profiles.mapasamospravy,
                profiles.gps_x,
                profiles.gps_y,
                profiles.main,
                profiles.type,
                profiles.parent,
                profiles.popup_name,
                profiles.sum_mode,
                profiles.pbo_category_id,
            FROM app.profiles`
        )
        .then(() => {
            return knex.schema.alterTable('app.profiles', table => {
                table.dropForeign('section_id');
                table.dropColumn('section_id');
            })
        })
        .then(() => {
            return knex.schema.dropTable('app.sections');
        });
};