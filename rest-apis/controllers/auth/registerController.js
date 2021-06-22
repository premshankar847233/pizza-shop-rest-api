import Joi from 'joi';
import CustomErrorHandler from '../../services/CustomErrorHandler.js'; 
import {RefreshToken, User} from '../../models/index.js';
import bcrypt from 'bcrypt';
import JwtService from '../../services/jwtService.js';
const registerController = {

   async register(req,res,next){

        // checklist

        // [ ] validate the request


        // [ ] authorisse the request
        // [ ] check if user is in the database already
        // [ ] prepare model
        // [ ] store in database
        // [ ] generate jwt tokens
        // [ ] send response


        //validation
        const registerSchema = Joi.object({

            name : Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            repeat_password: Joi.ref('password')

        });

        const {error} = registerSchema.validate(req.body);

        if(error){
            
            return next(error);
        }
        // res.json({msg:"Hello from Express"});
        //check if a user exist in database or not
        try
        {
            const exist = await User.exists({email:req.body.email});

            if(exist)
            {
                return next(CustomErrorHandler.alreadyExist('This email is already taken!')); 
            }
        }
        catch(err)
        {
            return next(err);
        }

        //Hash Password
        const {name,email,password} =  req.body; 
        console.log(password);
        const hashedPassword = await bcrypt.hash(password,10);
        console.log(hashedPassword);

        //prepare the model
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        //saving the user
        //create Token

        let access_token;
        let refresh_token;
        try
        {
            const result = await user.save();
            console.log(result);

            //token
            access_token = JwtService.sign({_id:result._id,role:result.role});
            console.log(access_token);
            refresh_token = JwtService.sign({_id: result._id, role:result.role},'1yr');

            await RefreshToken.create({token:refresh_token});
        }
        catch(err)
        {
            return next(error);
        }

        res.json({access_token : access_token,refresh_token:refresh_token});
    }
}

export default registerController;