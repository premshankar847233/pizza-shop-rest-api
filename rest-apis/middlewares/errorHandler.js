import { DEBUG_MODE } from '../config/index.js';

import pkg   from 'joi';
import CustomErrorHandler from '../services/CustomErrorHandler.js';
const {ValidationError} = pkg;
const errorHandler = (error, req,res,next) =>{

    let statusCode = 500;
    let data = {

        message : 'Internal Server Error',
        ...(DEBUG_MODE === 'true' && {originalError : error.message})
    }

    if(error instanceof ValidationError){

        statusCode = 422;
        data = {
            message : error.message
        }
    }

    if(error instanceof CustomErrorHandler)
    {
        statusCode = 409;
        data = {
            message : error.message
        }
    }

    

    return res.status(statusCode).json(data);
}
export default errorHandler;