import mongoose from "mongoose";
import { creatAppointmentservice } from "../../../src/services/appointment/createAppointment.service";
import { AppointmentRepository } from "../../../src/repositories/appointementRepository";
import { UserRepository } from "../../../src/repositories/userRepository";

jest.mock("../../../src/repositories/appointementRepository");
jest.mock("../../../src/repositories/userRepository");

describe("creatAppointmentservice", () => {
  const mockDate = new Date();
  const mockNotes = "Follow-up on progress";
  const mockNutritionistId = new mongoose.Types.ObjectId().toString();
  const mockClientId = new mongoose.Types.ObjectId().toString();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test success case — valid nutritionist and client
  test("should create an appointment successfully for valid users", async () => {
    const mockAppointment = { _id: "appointment123" };

    (UserRepository.findById as jest.Mock)
      .mockResolvedValueOnce({ _id: mockNutritionistId, role: "nutritionist" }) // nutritionist
      .mockResolvedValueOnce({ _id: mockClientId, role: "client", assignedNutritionist: "someId" }); // client

    (AppointmentRepository.create as jest.Mock).mockResolvedValue(mockAppointment);

    const result = await creatAppointmentservice(
      mockDate,
      mockNutritionistId,
      mockClientId,
      mockNotes
    );

    expect(AppointmentRepository.create).toHaveBeenCalledWith({
      date: mockDate,
      nutritionist: mockNutritionistId,
      client: mockClientId,
      notes: mockNotes,
    });
    expect(result).toEqual(mockAppointment);
  });

  // Test error when nutritionist is invalid
  test("should throw error if nutritionist is invalid", async () => {
    (UserRepository.findById as jest.Mock).mockResolvedValueOnce(null); // nutritionist not found

    await expect(
      creatAppointmentservice(mockDate, mockNutritionistId, mockClientId, mockNotes)
    ).rejects.toThrow("Invalid nutritionist ID");
  });

  // Test error when client is invalid
  test("should throw error if client is invalid", async () => {
    (UserRepository.findById as jest.Mock)
      .mockResolvedValueOnce({ _id: mockNutritionistId, role: "nutritionist" }) // nutritionist valid
      .mockResolvedValueOnce(null); // client invalid

    await expect(
      creatAppointmentservice(mockDate, mockNutritionistId, mockClientId, mockNotes)
    ).rejects.toThrow("Invalid ID");
  });

  // Test client gets assigned a nutritionist if not already assigned
  test("should assign nutritionist to client if client has no assignedNutritionist", async () => {
    const mockAppointment = { _id: "appointment999" };

    (UserRepository.findById as jest.Mock)
      .mockResolvedValueOnce({ _id: mockNutritionistId, role: "nutritionist" })
      .mockResolvedValueOnce({ _id: mockClientId, role: "client", assignedNutritionist: null });

    (AppointmentRepository.create as jest.Mock).mockResolvedValue(mockAppointment);
    (UserRepository.save as jest.Mock).mockResolvedValue(true);

    const result = await creatAppointmentservice(
      mockDate,
      mockNutritionistId,
      mockClientId,
      mockNotes
    );

    expect(UserRepository.save).toHaveBeenCalledWith(expect.any(mongoose.Types.ObjectId));
    expect(result).toEqual(mockAppointment);
  });
});
