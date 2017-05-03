var gulp = require("gulp");

gulp.task("update-contracts",require("./server/tasks/update-contracts"));

gulp.task("export-budgets-json",require("./server/tasks/export-budgets-json"));
gulp.task("export-entities-json",require("./server/tasks/export-entities-json"));
gulp.task("export-profiles-json",require("./server/tasks/export-profiles-json"));