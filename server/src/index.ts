const packageJSON = require("../package.json");

(async function () {

    console.log("Starting CityVizor");
    console.log("Node version: " + process.version);
    console.log("CityVizor version: " + packageJSON.version);

    /* SERVER */
    await import("./server");

    /* WORKER */
    await import("./worker");

})();
