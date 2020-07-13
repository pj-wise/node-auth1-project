const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const sessions = require('express-session');
const KnexSessionStore = require('connect-session-knex')(sessions);

const Users = require('./users/user-model.js');
const userRouter = require('./users/user-router.js');
const knexConfig = require('./data/dbConfig.js');

const server = express();

const sessionConfiguration = {
  name: 'ohfosho',
  secret: 'keep it secret, keep it safe!', 
  cookie: {
    httpOnly: true, 
    maxAge: 1000 * 60 * 60,
    secure: false, 
  },
  resave: false,
  saveUninitialized: true, 

  // change to use our database instead of memory to save the sessions
  store: new KnexSessionStore({
    knex: knexConfig,
    createtable: true, // automatically create the sessions table
    clearInterval: 1000 * 60 * 30, // delete expired sessions every 30
  }),
};

server.use(sessions(sessionConfiguration));
server.use(helmet());
server.use(express.json());
server.use(cors());

server.use('/api/users', userRouter);

server.post('/api/register', (req, res) => {
  let user = req.body;

  if (user.username && user.password) {
    user.password = bcrypt.hashSync(user.password, 14);

    Users.add(user)
      .then(saved => {
        res.status(201).json(saved);
      })
      .catch(error => {
        res.status(500).json({message:'There was a problem adding user'});
      });
  } else {
    res.status(400).json({ message: 'Please submit a username and password' });
  }
});

server.post('/api/login', (req, res) => {
  let { username, password } = req.body;
  if (username && password) {
    Users.findByUN(username)
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
          req.session.username = user.username;
          res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: 'You shall not pass!' });
      }
    })
    .catch(error => {
      res.status(500).json({message:'There was a problem getting user'});
    });
  }

});

server.get('/api/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      res.status(200).json({message:'you have been logged out'});
    });
  } else {
    res.status(200).json({ message: 'already logged out' });
  }
});

module.exports = server;