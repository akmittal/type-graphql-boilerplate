import { User } from "./../../entity/User";

export interface Context {
  user?: User;
  error?:Error
}