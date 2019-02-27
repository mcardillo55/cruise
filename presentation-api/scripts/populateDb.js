const cheerio = require('cheerio')
const request = require('request')
const Presentation = require('../models/presentation')
const sequelize = require('../db/sequelize')

request('https://shmoocon.org/2018/12/13/2019-speaker-line-up/', function(err, res, body) {
    const $ = cheerio.load(body)
    let presentations = []
    $('.post-content li').each(function (i) {
        const [title, presenter] = $(this).text().split('–').map(function(item) {
            return item.trim();
        })
        presentations.push({
            title: title,
            presenter: presenter
        })
    })
    sequelize.sync()
    .then(() => {
        Presentation.bulkCreate(presentations)
    })
})

