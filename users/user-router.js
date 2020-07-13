const router = require('express').Router();

const Users = require('./user-model.js');
const restricted = require('../restricted.js');

router.get('/', restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      res.status(500).json({ message: 'There was a problem getting users' });
    })
});

module.exports = router;