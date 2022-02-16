// Логи сервера, сохраняются в /serverLog/ntkServer.log

const SimpleNodeLogger = require('simple-node-logger')
const opts = {
	logFilePath: serverPath + '/server.log',
	timestampFormat: 'DD.MM.YYYY HH:mm:ss'
}
module.exports = SimpleNodeLogger.createSimpleLogger(opts)