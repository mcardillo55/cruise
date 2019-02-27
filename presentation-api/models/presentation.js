const Sequelize = require('sequelize')
const sequelize = require('../db/sequelize')

const Presentation = sequelize.define('presentation', {
    title: Sequelize.STRING,
    presenter: Sequelize.STRING
});

module.exports = Presentation;