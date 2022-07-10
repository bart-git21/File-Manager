// ============ здесь конфигурация сервера

const bodyParser = require('body-parser'); // создаем парсер для данных application/x-www-form-urlencoded
// иначе говоря: создаем переменную, которая будет получать данные из post-запроса
// считывает тело запроса и разбирает его
// данные доступны в request.body

module.exports = () => {
    return bodyParser.urlencoded({ extended: true });
    // app.use(express.json()); // это позволяет не require(body-parser), но у меня это не работает
    // app.use(express.urlencodedParser()); // это здесь не работает
}