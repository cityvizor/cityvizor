var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var CronJob = require('cron').CronJob;
var moment = require("moment");
var async = require("async");
var config = require("../config");
console.log("Setting up CityVizor cron job at " + config.cron.cronTime);
var job = new CronJob({
    cronTime: config.cron.cronTime,
    start: true,
    runOnInit: config.cron.runOnInit,
    timezone: 'Europe/Prague',
    onTick: function () { return runCron(); }
});
function runCron() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, mongoose, connect, tasks, task, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("\n=============================");
                    console.log("##### MIDNIGHT CRON RUN #####");
                    console.log("=============================");
                    console.log("\nNode version: " + process.version);
                    console.log("Started at " + moment().format("D. M. YYYY, H:mm:ss") + ".\n");
                    _a = require("./db"), mongoose = _a.mongoose, connect = _a.connect;
                    return [4 /*yield*/, connect()];
                case 1:
                    _b.sent();
                    tasks = [];
                    tasks.push({ exec: require("./tasks/download-contracts"), name: "Download contracts from https://smlouvy.gov.cz/" });
                    tasks.push({ exec: require("./tasks/download-noticeboard"), name: "Download notice board documents from https://eDesky.cz/" });
                    tasks.push({ exec: require("./tasks/autoimports"), name: "Process auto imports of data" });
                    tasks.push({ exec: function () { return mongoose.disconnect(); }, name: "Disconnect database" });
                    // function to run each task
                    console.log("Starting tasks...");
                    _b.label = 2;
                case 2:
                    if (!tasks.length) return [3 /*break*/, 8];
                    task = tasks.shift();
                    console.log("\n===================================");
                    console.log("Task: " + task.name);
                    console.log("===================================");
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, task.exec()];
                case 4:
                    _b.sent();
                    console.log("Task finished.");
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _b.sent();
                    console.error("Error: " + err_1.message);
                    return [3 /*break*/, 6];
                case 6: return [4 /*yield*/, new Promise(function (resolve, reject) { return setTimeout(resolve, config.cron.jobDelay * 1000); })];
                case 7:
                    _b.sent();
                    return [3 /*break*/, 2];
                case 8:
                    console.log("===================================\n\n");
                    console.log("Finished all at " + moment().format("D. M. YYYY, H:mm:ss") + "!");
                    return [2 /*return*/];
            }
        });
    });
}
