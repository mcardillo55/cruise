const Sequelize = require('sequelize')
const sequelize = require('../db/sequelize')
const Presentation = require('../models/presentation')

const Survey = sequelize.define('survey', {
    interesting: Sequelize.BOOLEAN,
    seating: Sequelize.BOOLEAN,
    links: Sequelize.STRING,
    interesting_topics: Sequelize.STRING,
    uninteresting_topics: Sequelize.STRING,
    rating: Sequelize.INTEGER,
    other_feedback: Sequelize.STRING
});

Survey.belongsTo(Presentation, { foreignKey: 'presentationID' })

module.exports = Survey;