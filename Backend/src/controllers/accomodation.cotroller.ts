import express, { Request, Response } from "express";
import * as accommodationService from "../services/accommodation.service";

export const getAllAccommodations = async (req: Request, res: Response) => {
  try {
    const accommodations = await accommodationService.getAll();
    res.status(200).json(accommodations);
  } catch (error) {
    console.error("Error in fetching all accomodations", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAccommodationById = async (req: Request, res: Response) => {
    try{
        const id = parseInt(req.params.id)
        const accommodation = await accommodationService.getById(id);
        res.status(200).json(accommodation)
    }catch(error){
        console.log("Getting ")
    }
}
