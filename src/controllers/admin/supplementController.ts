import { Request, Response } from "express";
import SupplementCategory from "../../models/SupplementCategory";
import Supplement from "../../models/Supplement";


export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await SupplementCategory.create({
      name: req.body.name,
      description: req.body.description,
    });

    res.status(201).json({ success: true, category });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};



export const createSupplement = async (req: Request, res: Response) => {
  try {
    const supplement = await Supplement.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      imageUrl: req.body.imageUrl,
      category: req.body.categoryId,
    });

    res.status(201).json({ success: true, supplement });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};



export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await SupplementCategory.find();
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};


export const getSupplementsByCategory = async (req: Request, res: Response) => {
  try {
    const supplements = await Supplement.find({
      category: req.params.id,
    });

    res.json(supplements);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};