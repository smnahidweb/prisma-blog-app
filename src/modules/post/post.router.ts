import express, { type NextFunction, type Request, type Response } from 'express';
import { PostController } from './post.controller';
import { auth } from '../../lib/auth';
import { success } from 'better-auth';

export enum UserRole{
    USER  = "USER",
    ADMIN = "ADMIN"
} 

declare global {
    namespace Express {
        interface Request {
            user?:{
                id: string;
                email:string;
                name:string;
                role:string;
                emailVerified:boolean;
            }
        }
    }
}

const router  = express.Router();

const authMiddleare = (...roles : UserRole[]) => {

    return async (req:Request,res:Response,next:NextFunction) => {

  
         // get session from request
         const session = await auth.api.getSession({
            headers : req.headers as any,

         })
       if(!session || !session.user){
        return res.status(401).json({
            success: false,
            message : "Unauthorized access",
        })
    }

        if(session.user.emailVerified===false){
            return res.status(403).json({
                success: false,
                message : "Please verify your email to access this resource",
            })
        }

        req.user = {
            id : session.user.id,
            email : session.user.email,
            name : session.user.name,
            role: (session.user.role ?? "USER").toUpperCase() as UserRole,
            emailVerified : session.user.emailVerified
        }

         if(roles.length > 0 && !roles.includes(req.user.role as UserRole)){
           return res.status(404).json({
            success : false,
            message : "You are not authorized to access this resource"
           })
         }

         next();


}
}

router.post('/', authMiddleare(UserRole.USER),
    PostController.createPost
)


export const PostRouter =  router;