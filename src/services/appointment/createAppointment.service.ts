import mongoose from "mongoose";
import { AppointmentRepository } from "../../repositories/appointementRepository";
import { UserRepository } from "../../repositories/userRepository";


export const creatAppointmentservice = async(date: Date, nutritionistId: string, clientId: string, notes: string) => {
  const nutritionist = await UserRepository.findById(nutritionistId);
   const client = await UserRepository.findById(clientId);
 
   if (!nutritionist || nutritionist.role !== "nutritionist") {
     throw new Error("Invalid nutritionist ID");
   }
   if (!client || client.role !== "client") {
     throw new Error("Invalid ID");
   }
 
   const appointment = await AppointmentRepository.create({
     date,
     nutritionist: nutritionistId,
     client: clientId,
     notes,
   });
 
   if (!client.assignedNutritionist) {
     const assignedNutritionist = new mongoose.Types.ObjectId(nutritionistId);
     await UserRepository.save(assignedNutritionist);
   }
 
   return appointment;

};