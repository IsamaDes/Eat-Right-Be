import Appointment from "../models/Appointment";

export const AppointmentRepository = {
  async create(data: {
    date: Date;
    nutritionist: string;
    client: string;
    notes?: string;
  }) {
    const appointment = new Appointment(data);
    return await appointment.save();
  },

  async findById(id: string) {
    return await Appointment.findById(id)
      .populate("nutritionist", "name email")
      .populate("client", "name email");
  },

  async findByDoctorId(doctorId: string) {
    return await Appointment.find({ doctor: doctorId })
      .populate("client", "name email")
      .sort({ date: -1 });
  },

  async findByPatientId(patientId: string) {
    return await Appointment.find({ patient: patientId })
      .populate("nutritionist", "name email")
      .sort({ date: -1 });
  },
  async save(appointment: any){
    const saved = await appointment.save();
    return await saved.populate({ path: "client", select: "name email" },
  { path: "nutritionist", select: "name email" })
  }
};
