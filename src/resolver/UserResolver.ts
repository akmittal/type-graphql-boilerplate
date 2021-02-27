import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import jwt from 'jsonwebtoken';
import { User } from './../entity/User';
import { NewUserInput } from './types/user-input';
import { getJWTSecret } from '../util';
import { classToPlain } from 'class-transformer';

const oneWeek = 60 * 60 * 24 * 7; // a week

@Resolver((of) => User)
export class UserResolver {
    @Authorized()
    @Query((returns) => User)
    async user(@Arg('id') id: string) {
        const user = await User.findOne(id);
        if (user === undefined) {
            throw new Error(id);
        }
        return user;
    }

    @Mutation((returns) => String)
    async signIn(@Arg('username') username: string, @Arg('password') password: string): Promise<string> {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            throw new Error('Username/password not correct');
        }
        const isCorrectPassword = user?.isCorrectPassword(password);
        if (isCorrectPassword) {
     
            return jwt.sign(classToPlain(user), getJWTSecret(), {algorithm:'HS512', expiresIn: oneWeek});
        } else {
            throw new Error('Username/password not correct');
        }
    }

    @Mutation((returns) => User)
    signUp(@Arg('newuserData') newUserData: NewUserInput): Promise<User> {
      console.log("mutation")
        let newuser = new User();
        newuser.username = newUserData.username
        newuser.password = newUserData.password
        newuser.email = newUserData.email
        newuser.firstName = newUserData.firstName
        newuser.lastName = newUserData.lastName
        newuser.creationDate = new Date();

        
        return newuser.save();
    }
}
