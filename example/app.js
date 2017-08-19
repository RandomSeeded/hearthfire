const service = require('./service');
const bot = require('./bot');

service.RockApiService.run(new bot.RockBot(), '127.0.0.1', 7625);
