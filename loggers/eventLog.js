const { LogEvent } = require('../models')

// Логирование с сохранением в базу данных, сохраняет взаимодействия пользователей с базой данных
module.exports = async (req, change, consoleLog = false) => {
    const ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() || req.socket.remoteAddress
    const result = await LogEvent.create({
        change,
        ip,
        changerId: req.user.id,
    })
    const logEvent = result.dataValues
    if (consoleLog) {
        console.log(`Log # UID: ${req.user.id} (${ip}) [${new Date(logEvent.createdAt).toLocaleString()}] - ${change}`)
    }
}