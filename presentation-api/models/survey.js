const Sequelize = require('sequelize')
const sequelize = require('../db/sequelize')

const Survey = sequelize.define('survey', {
    interesting: Sequelize.BOOLEAN,
    seating: Sequelize.BOOLEAN,
    interesting_topics: Sequelize.STRING,
    uninteresting_topics: Sequelize.STRING,
    rating: Sequelize.INTEGER,
    other_feedback: Sequelize.STRING
});

module.exports = Survey;