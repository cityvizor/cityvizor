var express = require('express');
var app = express();

app.use("/api",require("./routers/api.js"));

app.use(require("./routers/static"));

app.get('*',(req,res) => {
	res.sendFile("app/index.html", { root: __dirname + "/.." });	
});

app.listen(3000, function () {
	console.log('Supervizor Plus Server listening!')
})