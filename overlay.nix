self: super: {
  cityvizor = {
    server        = import ./server {};
    server-kotlin = import ./server-kotlin {};
    client        = import ./client {};
    landing-page  = import ./landing-page {};
    db-demo-dump = "${./database/demo_dump.sql}";
  };
}
