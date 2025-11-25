import express, { Request, Response } from "express";
import {AccommodationService} from "../services/accommodation.service";
import { Accommodation, CreateAccommodationDto } from "../common/types/types";

const accommodationService = new AccommodationService();

export const getAllAccommodations = async (req: Request, res: Response) => {
  try {
    const accommodations = await accommodationService.getAll();

    if (accommodations == null) {
      res.status(404).json({ message: "No accommodations found" });
    }

    res.status(200).json(accommodations);
  } catch (error) {
    console.error("Error in fetching all accomodations", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//get by id
export const getAccommodationById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const accommodation = await accommodationService.getById(id);
    res.status(200).json(accommodation);
  } catch (error) {
    console.log("Getting accommodation error:", error);
    res.status(404).json({ message: "Accomodation not Found" });
  }
};

//get by city
export const getAccommodationByCity = async (req: Request, res: Response) => {
  try {
    const city = req.params.city;
    const accommodation = await accommodationService.getByCity(city);
    res.status(200).json(accommodation);
  } catch (error) {
    console.log("Getting accommodation error:", error);
    res.status(404).json({ message: "Accomodation not Found" });
  }
};

//update
export const updateAccommodation = async (req: Request, res: Response) => {
  const id = req.params.id;
  const data: Partial<Accommodation> = req.body;

  try {
    const updatedAccommodation = await accommodationService.update(id, data);

    if (!updateAccommodation) {
      res.status(404).json({ message: "Accomodation not found" });
    }

    return res.status(200).json({ updatedAccommodation });
  } catch (error) {
    console.log("Error in updating", error);
  }
};

//create
export const createAccommodation = async (req: Request, res: Response) => {
  const data: CreateAccommodationDto = req.body;

  try {
    const createdAccommodation = await accommodationService.create(data);
    res.status(201).json(createdAccommodation);
  } catch (error) {
    console.log("Error in adding an accommodation", error);
    return res.status(400).json({ message: "Bad Request" });
  }
};

//delete
export const deleteAccommodation = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const deteledAccommodation = await accommodationService.delete(id);

    return res.status(200).json(deleteAccommodation);
  } catch (error) {
    console.log("Error in Deleting accommodation", error);
    res.status(404).json({message: "Could not find accommodation"})
  }
};
