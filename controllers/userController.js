const tokenService = require('../service/tokenService');
const userService = require('../service/userService');



// из этого класса мы уже возвращаем ответ на клиент в виде RESPONSE
class UserController {
  async signup(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.signup222(email, password);
      // передаем в куках новый рефреш токен на клиент('название куки', 'сам рефреш токен')
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      }); //сколько живет кук http onky - нужне для того что бы нельзя было изменить куку из браузера(js)
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async signin(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.signin222(email, password);
      // передаем в куках на клиент рефреш токен пользоавтеля из БД
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  // аккаунт пользователя остается, но удаляется рефреш токен (то есть пользователь выходит из аккаунта)
  async logout(req, res, next) {
    try {
        // достаем рефреш токен из куков(можем достать так как мы ее туда засунули при авторизации пользователя)
        const {refreshToken} = req.cookies
        const token = await tokenService.removeToken(refreshToken)
        // удаляем куку с рефреш токеном у пользователя
        res.clearCookie('refreshToken')
        res.json(`Токен ${token} - успешно деактивирован. Аккаунт удален.`)

    } catch(e) {
        next(e)
    }
  }

  async refresh(req, res, next) {
    // для обновления токенов, нам нужно достать из куки рефреш токен юзера
    try {
        const {refreshToken} = req.cookies
        const userData = await userService.refresh(refreshToken) //достаем рефреш токен из куков
        // функция по генерации куки(куки токена)
        res.cookie('refreshToken', userData.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
          });
          return res.json(userData);
    } catch(e) {
        next(e)
    }
  }

  async getUsers(req, res, next) {
    try {
        const users = await userService.getAllUsers()
        return res.json(users)
    } catch (e) {
        res.json('нет доступа')
    }
  }
}

module.exports = new UserController();
