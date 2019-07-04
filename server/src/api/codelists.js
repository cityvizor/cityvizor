const express = require('express');
const app = express();

const router = express.Router();
module.exports = router;

const schema = require('express-jsonschema');
const acl = require("express-dynacl");

const path = require("path");

const codelists = {
	"item-names": require("../../assets/codelists/item-names.json"),
	"item-groups": require("../../assets/codelists/item-groups.json"),
	"paragraph-names": require("../../assets/codelists/paragraph-names.json"),
	"paragraph-groups": require("../../assets/codelists/paragraph-groups.json")
}

router.get("/", acl("codelists", "list"), (req, res, next) => {

	res.json(Object.keys(codelists));

});

router.get("/:name", acl("codelists", "read"), (req, res, next) => {
	if (codelists[req.params.name]) res.json({
		_id: req.params.name,
		codelist: codelists[req.params.name]
	});
	else res.sendStatus(404);
});