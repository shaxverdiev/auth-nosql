const tokenService = require('../service/tokenService');
// через этот mw проходят запросы пользователей. mw-auth проверяет авторизирован ли пользователь(верифицирует bearer(тип токена) токен )и если такой пользователь есть в БД - открывается доступ к ресурсам)
// next - вызывает следующий в цепочке mw
module.exports = function (req, res, next) {
  try {
    // достаем из заголовка токен авторизации, если его нет - выводим следующее сообзение
    const authHeader = req.headers.authorization;
    console.log('authhhhhhhhh',authHeader)
    if (!authHeader) {
      console.log('ЗАкрыт доступ , пользователь не авторизирован');
      return new Error('ошибка')
    }
  
    // так как в заголовке(авторизация)  (и это строка) мы разбиваем строку на 2 элемента(Bearer и сам токен) и достаем access токен
    const accessToken = authHeader.split(' ')[1];
    console.log('accccccc',accessToken)
    if (!accessToken) {
      console.log('В заголовке не обнаружен access токен(authMW)');
      return new Error('ошибка')
    }

    // если же обнаружен access токен - валидируем его
    const userData = tokenService.validateAccessToken(accessToken);
    console.log(userData)
    if (!userData) {
      console.log('Не удалось совершить валидацию токена(authMW)');
      return new Error('ошибка')
    }

    // если все ок и валидация прошла успешно - возвращаем данные пользователя
    
    // и вызываем(передаем управление в) следующий mw или функцию
    next();
  } catch (e) {
    console.log('Ошибка Авторизации или Верификации');
    return new Error('ошибка')
  }
};
