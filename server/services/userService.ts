import { Response } from "express"
import redis from "../utlis/redis"
import { User } from "../models/User"

export const getUserById = async(id : string , res : Response) => {
    const userJson = await redis.get(id) 

    if(userJson){
        const user = JSON.parse(userJson as string)
        res.status(200).json({
            success:true,
            user
        })
    }
}

//get all users for admin
export const getAllUsersService = async(res : Response)=>{
    const users = await User.find().sort({createdAt : -1})

    res.status(200).json({
        success : true,
        message : "Users fetched Succefully",
        users
    })
}

// update user role

export const updateUserRoleService = async(res : Response , id : string , role : string)=>{
       const user = await User.findByIdAndUpdate(id , {role} , {new : true})

       // Update Redis cache
       if(user){
           await redis.set(id, JSON.stringify(user))
       }

        res.status(200).json({
        success : true,
        message : "User's role updated Succefully",
        user
    })
}
