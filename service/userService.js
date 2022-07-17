const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const UserPayload = require('../userPayload/userPayload');
const tokenService = require('../service/tokenService');
const userModel = require('../models/userModel');
const TokenModel = require('../models/tokenModel');

class UserService {
  async signup222(email, password) {
    const potentialUser = await UserModel.findOne({ email });
    if (potentialUser) {
      console.log('Пользователь с таким email уже существует....');
    }
    // хэшируем полученный пароль с клиента
    const hashPassword = await bcrypt.hash(password, 3);

    // создаем нового пользователя в БД
    const newUser = await UserModel.create({ email, password: hashPassword });

    // этот payload нужен для генерации токенов
    const payload = { email };

    // генерируем токены для нового пользователя
    const tokens = tokenService.generateTokens(payload);

    // сохраняем полученный токен в БД
    await tokenService.saveToken(newUser.id, tokens.refreshToken);

    return { ...tokens, user: payload };
  }



  async signin222(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      console.log('Пользователь с такой почтой не найден');
    }

    // сверяем пароль пользователя с паролем из БД
    const isPassword = await bcrypt.compare(password, user.password); //("пароль из тела запроса", "пароль из БД")
    if (!isPassword) {
      console.log('неверный пароль');
    }

    // теперь генерируем новый токен, если время истекло то создается новый
    const payload = { email };
    const tokens = tokenService.generateTokens(payload);

    // сохраняем либо перезаписвваем рефреш токен в БД
    await tokenService.saveToken(user.id, tokens.refreshToken);
    console.log('success..!');
    return { ...tokens, user: payload };
  }



  async refresh(refreshToken) {
    if (!refreshToken) {
      console.log('Пользователь не авторизован...');
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDB) {
      console.log('Токен не найден в БД. Пользователь не авторизован..');
    }

    // находим пользователя по id который мы получили после верефикации
    const user = await TokenModel.findOne(userData)/////////////////////////////////////////////
    // теперь генерируем новый токен, если время истекло то создается новый
    console.log('userID-----------------',user._id)
    console.log('-------------------------------------------------')
    const payload = {user};
    const tokens = tokenService.generateTokens(payload);

    // console.log('обновленный токенs----', tokens)
    // сохраняем либо перезаписвваем рефреш токен в БД
    await tokenService.saveToken(user._id, tokens.refreshToken);
    console.log('Токены обновлены!');
    return { ...tokens, user };
  }

  
  // функция для получения списка юзеров(только для авторизированных пользователей)
  async getAllUsers() {
    const users = await UserModel.find();
    return users;
  }
}

module.exports = new UserService();
