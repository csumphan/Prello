var Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://prello:prello@localhost:5432/prello');
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

  module.exports = sequelize;

//Query to get boards from user id
// SELECT users.id, users.username, users.email, boards.*
//  FROM user, boards
//  WHERE user.id = 1;

// SELECT b.*, u.id, u.username, u.email
//   FROM boards AS b
//   JOIN users AS u
//   ON u.id = b.authorid
//  WHERE b.authorid = 1

//var boardQuery = `<copy and paste ^^^^^>`
