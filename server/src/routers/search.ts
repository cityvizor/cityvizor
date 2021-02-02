import express from 'express';

export const SearchRouter = express.Router({mergeParams: true});

const acl = require('express-dynacl');

SearchRouter.post('/counterparties', acl('payments', 'list'), (req, _, __) => {
);

SearchRouter.post('/payments', acl('payments', 'list'), (req, _, __) => {

});
