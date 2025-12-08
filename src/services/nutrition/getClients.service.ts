import { NutritionistRepository } from "../../repositories/nutritionistRepository";

export const getNutritionistClients = async(nutritionistId: string) => {
   const clients = await NutritionistRepository.findClientsByNutritionistId(nutritionistId);
   return clients;
}