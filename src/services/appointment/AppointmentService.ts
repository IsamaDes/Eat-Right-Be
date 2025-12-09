import { AppointmentRepository } from "../../repositories/appointementRepository";

export default class AppointmentService {
  static async createAppointment(data: {
    date: Date;
    nutritionistId: string;
    clientId: string;
    notes?: string;
  }) {
    return AppointmentRepository.create(data);
  }

  static async getAppointmentById(id: string) {
    const appointment = await AppointmentRepository.findById(id);
    if (!appointment) {
      throw new Error(`Appointment with ID ${id} not found`);
    }
    return appointment;
  }

  static async getAppointmentsForNutritionist(nutritionistId: string) {
    return AppointmentRepository.findByNutritionistId(nutritionistId);
  }

  static async getAppointmentsForClient(clientId: string) {
    return AppointmentRepository.findByClientId(clientId);
  }

  static async updateAppointment(id: string, updates: Partial<{
    date: Date;
    notes?: string;
    nutritionistId: string;
    clientId: string;
    status: string;
  }>) {
    const appointment = await AppointmentRepository.save({ id, ...updates });
    return appointment;
  }

  
  static async deleteAppointment(id: string) {
    return AppointmentRepository.delete(id);
  }
}
