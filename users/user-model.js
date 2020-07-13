const db = require('../data/dbConfig.js');

module.exports = {
  add,
  find,
  findByUN,
  findById,
};

function find() {
  return db('users');
}

function findByUN(username) {
  return db('users')
  .where({username})
  .first();
}

function findById(id) {
  return db('users')
    .where({ id })
    .first();
}

function add(user) {
  return db('users')
    .insert(user, 'id')
    .then(ids => {
      const [id] = ids;
      return findById(id);
    });
}

