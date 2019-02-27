const Sequelize = require('sequelize')
const path = require('path');

const sequelize = new Sequelize('database', 'root', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: path.join(__dirname, 'db.sqlite'),
    operatorsAliases: false
});

module.exports = sequelize;