import express from 'express';
import { APP_PORT,DB_URL } from './config/index.js';
import errorHandler from './middlewares/errorHandler.js';
import routes from './routes/index.js';
import mongoose from 'mongoose';
import path from 'path';


//database connection
mongoose.connect(DB_URL,{
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useFindAndModify : false,
    useCreateIndex : true

});

const db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',()=>{
    console.log('DB connected.....');
});


const app = express(); 
global.appRoot = path.resolve("");
console.log(appRoot);
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(routes);
app.use(errorHandler);
app.use('/uploads',express.static('uploads'));




app.listen(APP_PORT,()=> console.log(`Listening on port ${APP_PORT}.`));
