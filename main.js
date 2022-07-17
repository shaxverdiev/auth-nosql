require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./router/mainRouter')
// const payCONSOLE = require('./service/userService')

const PORT = process.env.PORT;
const app = express();

//перед тем как попасть на роуты, запрос проходит через эти middleware
app.use(express.json())
app.use(cookieParser()) // mw для работы с куками
app.use(cors())
app.use(router)



// функция запускающая сервер и подключение к базе данных
const start = async () => {
  await mongoose.connect(
    process.env.DB_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true, 
    },
    () => console.log('Connection with DB is correct....')
  );

    // payCONSOLE.payCONSOLE()

  app.listen(PORT, () => {
    console.log(`Server start on PORT: ${PORT}....`);
  });
};

  start();
 