module.exports = (req, res, next) => {
  console.log('session',req.session)
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({ message: 'You cannot pass!' });
  }
};