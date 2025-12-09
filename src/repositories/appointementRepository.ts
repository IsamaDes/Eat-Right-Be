import { prisma } from "../lib/prisma";

export const AppointmentRepository = {
  // Create a new appointment
  async create(data: {
    date: Date;
    nutritionistId: string;
    clientId: string;
    notes?: string;
  }) {
    return prisma.appointment.create({
      data: {
        date: data.date,
        nutritionistId: data.nutritionistId,
        clientId: data.clientId,
        notes: data.notes,
      },
      include: {
        nutritionist: { select: { id: true, name: true, email: true } },
        client: { select: { id: true, name: true, email: true } },
      },
    });
  },

  // Find appointment by ID
  async findById(id: string) {
    return prisma.appointment.findUnique({
      where: { id },
      include: {
        nutritionist: { select: { id: true, name: true, email: true } },
        client: { select: { id: true, name: true, email: true } },
      },
    });
  },

  // Find appointments for a specific nutritionist
  async findByNutritionistId(nutritionistId: string) {
    return prisma.appointment.findMany({
      where: { nutritionistId },
      include: {
        client: { select: { id: true, name: true, email: true } },
      },
      orderBy: { date: "desc" },
    });
  },

  // Find appointments for a specific client
  async findByClientId(clientId: string) {
    return prisma.appointment.findMany({
      where: { clientId },
      include: {
        nutritionist: { select: { id: true, name: true, email: true } },
      },
      orderBy: { date: "desc" },
    });
  },

  // Update an existing appointment
  async save(appointment: any) {
    return prisma.appointment.update({
      where: { id: appointment.id },
      data: appointment,
      include: {
        nutritionist: { select: { id: true, name: true, email: true } },
        client: { select: { id: true, name: true, email: true } },
      },
    });
  },

  // Optional: delete appointment
  async delete(id: string) {
    return prisma.appointment.delete({
      where: { id },
    });
  },
};
