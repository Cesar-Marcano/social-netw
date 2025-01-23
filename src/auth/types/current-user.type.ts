import { Types } from "mongoose"

export interface ICurrentUser {
    email: string
    userId: Types.ObjectId
}