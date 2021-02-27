import { AuthChecker, ResolverData } from "type-graphql"
import { Context } from "../resolver/types/context";
import jwt from "jsonwebtoken";
import { User } from "../entity/User";

export const getJWTSecret = ():string => {
    return process.env["JWT_SECRET"] || ""
}

export const customAuthChecker: AuthChecker<Context> = ({ context: { user }} , roles) => {
    if (roles.length === 0) {
        // if `@Authorized()`, check only is user exist
        return user !== undefined;
      }
      // there are some roles defined now
    
      if (!user) {
        // and if no user, restrict access
        return false;
      }
      if (user.roles.some(role => roles.includes(role.name))) {
        // grant access if the roles overlap
        return true;
      }
    
      // no roles matched, restrict access
      return false;
}

export const getUser = (token:string):User => {
 const user:any =  jwt.verify(token, getJWTSecret())
 return user;
} 