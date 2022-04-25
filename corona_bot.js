require('dotenv').config()
const { Telegraf, Markup } = require('telegraf')
const api = require('covid19-api')
const COUNTRIES_LIST = require('./constans')


const bot = new Telegraf(process.env.BOT_TOKEN)



bot.start((ctx) => ctx.reply( `
Привіт, ${ctx.message.from.first_name}!
Взнавай статистистику по Covid-19.
Введи назву країни на англійській і отримуй статистику.
Подивитись весь список країн можна командою /help.` , Markup.keyboard([
  ['Ukraine', 'Us'], 
  ['Poland', 'Germany']
])
.oneTime()
.resize()
))


bot.help((ctx) => ctx.reply(COUNTRIES_LIST))


bot.on('text', async(ctx) =>
{
    let data = {};

    try{

    data = await api.getReportsByCountries(ctx.message.text);

    const formatData = ` 
Країна: ${data[0][0].country}
Випадки: ${data[0][0].cases} 
Смертей: ${data[0][0].deaths} 
Одужало: ${data[0][0].recovered}
    `

    ctx.reply(formatData);

    } catch{

        ctx.reply('Помилка, такої країни не існує! Перевірте її написання.');

    }

});


bot.launch()


process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

