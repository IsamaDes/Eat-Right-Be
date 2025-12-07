import { prisma } from "../lib/prisma";
import { NotFoundError, BadRequestError } from "../errors";
import { UserRepository } from "../repositories/userRepository";

export const getAdminDashboardService = async() => {

    const [clientCount, nutritionistCount, adminCount] = await Promise.all([
    UserRepository.countByRole("client"),
    UserRepository.countByRole("nutritionist"),
    UserRepository.countByRole("admin"),
  ]);

  const latestClients = await UserRepository.findLatestByRole("client", 5);
  const clients = await UserRepository.findAllUsersByRole("client");
  const nutritionist = await UserRepository.findAllUsersByRole("nutritionist");
  const admin = await UserRepository.findAllUsersByRole("admin");

   return {
    total: {
      clients: clientCount,
      nutritionists: nutritionistCount,
      admins: adminCount,
    },
    latestClients,
    clients,
    nutritionist,
    admin
  };
};

export const createUserService = async(name: string, email: string, password: string, role: string) => {
   if(!name || !email || !role){
    throw new Error("Missing required fields");
   };
   const existingUser = await UserRepository.findByEmail(email);
    if(existingUser) throw new Error("User Already Exist");
    const user = await UserRepository.create({name, email, password, role});
    return {id: user.id, email: user.email};
}

export const getUserByIdService = async(id: string) => {
  const existingUser = await UserRepository.findById(id);
 return existingUser
}






export const assignNutritionistToClientService = async (
  clientId: string,
  nutritionistId: string,
  assignedById?: string
) => {

  const clientProfile = await prisma.clientProfile.findUnique({
    where: { id: clientId },
    include: { user: true },
  });
  if (!clientProfile) {
    throw new NotFoundError(`Client with ID ${clientId} not found`);
  }

 
  const nutritionistProfile = await prisma.nutritionistProfile.findUnique({
    where: { id: nutritionistId },
    include: { user: true },
  });
  if (!nutritionistProfile) {
    throw new NotFoundError(`Nutritionist with ID ${nutritionistId} not found`);
  }

  if (nutritionistProfile.user.role !== "nutritionist") {
    throw new BadRequestError("The selected user is not a nutritionist");
  }

 
  const updatedClient = await prisma.clientProfile.update({
    where: { id: clientId },
    data: {
      assignedNutritionistId: nutritionistProfile.id,
    },
    include: {
      user: true,
      assignedNutritionist: { include: { user: true } },
    },
  });

  return {
    message: `Nutritionist ${nutritionistProfile.user.name} assigned to client ${clientProfile.user.name}`,
    client: updatedClient,
  };
};

