const router = require('express').Router();

const restricted = require('../restricted.js');

router.use(restricted());