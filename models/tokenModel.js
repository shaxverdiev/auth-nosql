// Это модель рефреш токена, благодаря которому каждый раз будет обновляться акссес токен(ссылаяясь на эту модель)

const {Schema, model} = require('mongoose')

const TokenSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'}, //это поле ссылается 
    refreshToken: {type: String, require: true}
})

module.exports = model('Token', TokenSchema)// User - название модели