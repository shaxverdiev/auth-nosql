const jwt = require('jsonwebtoken');
const tokenModel = require('../models/tokenModel');
// const jwtATS = process.env.JWT_ACCESS_SECRET;
// const jwtRTS = process.env.JWT_REFRESH_SECRET;
const jwtATS = 'jwtATS'
const jwtRTS = 'jwtRTS'

class TokenService {
  generateTokens(payload) {
    console.log(payload, jwtATS, jwtRTS);
    const accessToken = jwt.sign(payload, jwtATS, { expiresIn: '1m' });
    const refreshToken = jwt.sign(payload, jwtRTS, { expiresIn: '30d' });
    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await tokenModel.findOne({ user: userId });
    // если находит такой токен, то перезаписываем этот токен
    if (tokenData) {  
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await tokenModel.create({ user: userId, refreshToken });
    return token;
  }
  // удаляет токен для logout'a
  async removeToken(refreshToken) {
    // удаляем рефреш токен пользователя из БД
    const tokenData = await tokenModel.deleteOne({ refreshToken });
    console.log('Токен успешно удален!');
    return tokenData;
  }

  // функции для проверки - является ли этот токен "сделанным на нашем конвеере"
  validateAccessToken(token) {
    try { ///////////////////////////////////////////////////////////////////////////////
      console.log(token)
      const userData = jwt.verify(token, jwtATS);
      console.log('verify-----',userData )
      console.log('access токен провалидирован(tokenService')
      return userData;
    } catch (e) {
      console.log('валидация access токена не пройдена(tokenService');
      return null;
    }
  }

  // функции для проверки - является ли этот токен "сделанным на нашем конвеере"
  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, jwtRTS);
      return userData;
    } catch (e) {
      console.log('валидация refresh токена не пройдена(tokenService');
      return null;
    }
  }


  // функции для проверки - имеется ли такой рефреш токен у нас в БД
  async findToken(refreshToken) {
    const tokenData = await tokenModel.findOne({refreshToken})
    return tokenData
  }
}

module.exports = new TokenService();
