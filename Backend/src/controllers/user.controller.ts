import express, { Request, Response } from "express";
import * as userService from "../services/user.service.ts";
import User from "../types/user.type";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAll();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in fetching all accomodations", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
    try{
        const id = parseInt(req.params.id)
        const user = await userService.getById(id);
        res.status(200).json(user)
    }catch(error){
        console.log("Getting user error:", error)
        res.status(404).json({message: "Accomodation not Found"})
    }
}

export const updateUser = async (req: Request, res: Response) => {

    const id = parseInt(req.params.id)
    const data: Partial<User> = req.body

    try{
        
        const updatedUser  = await userService.update(id, data);

        if(!updateUser){
            res.status(404).json({message: "Accomodation not found"})
        }

        return res.status(200).json({updatedUser})
    }catch(error){
        console.log("Error in updating", error)
    }
}

export const createUser = async (req: Request, res: Response) => {
    
    const data: Partial<User> = req.body

    try{
        const createdUser  = userService.create(data)
        res.status(201).json(data)
    }catch(error){
        console.log("Error in adding an user", error)
        return res.status(400).json({message: "Bad Request"})
    }
}




