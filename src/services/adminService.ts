import { prisma } from "../lib/prisma";
import { NotFoundError, BadRequestError } from "../errors";
import { UserRepository } from "../repositories/userRepository";
import { AdminRepository } from "../repositories/adminRepository";
import { ClientRepository } from "../repositories/clientRepository";
import { NutritionistRepository } from "../repositories/nutritionistRepository";


export const getAdminDashboardService = async() => {

    const [clientCount, nutritionistCount, adminCount] = await Promise.all([
    UserRepository.countByRole("CLIENT"),
    UserRepository.countByRole("NUTRITIONIST"),
    UserRepository.countByRole("ADMIN"),
  ]);


  const clientsRawData = await UserRepository.findAllUsersByRole("CLIENT");
   const clients = clientsRawData.map((user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  clientProfileId: user.clientProfile?.id || null,
  clientUserProfileId: user.clientProfile?.userId || null,
  assignedNutritionist: user.nutritionistProfile || null,
}));
  const nutritionistsRawData = await UserRepository.findAllUsersByRole("NUTRITIONIST");
  const nutritionists = nutritionistsRawData.map((user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  nutritionistProfileId: user.nutritionistProfile?.id || null,
  nutritionistUserProfileId: user.nutritionistProfile?.userId || null,
  nutritionistProfile: user.nutritionistProfile || null,
}));
  const adminsRawData = await UserRepository.findAllUsersByRole("ADMIN");
   const admins = adminsRawData.map((user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  adminProfileId: user.adminProfile?.id || null,
}));

   return {
    total: {
      clients: clientCount,
      nutritionists: nutritionistCount,
      admins: adminCount,
    },
  
    clients,
    nutritionists,
    admins
  };
};

export const getUserByIdService = async(id: string) => {
  const existingUser = await UserRepository.findById(id);
 return existingUser
}

export const getAdminProfileService = async(id: string) => {
  const profile = await AdminRepository.getAdminProfile(id);
  return profile;
};


export const assignNutritionistToClientService = async (
  clientId: string,
  nutritionistId: string,
) => {
try{
  if (!clientId || !nutritionistId) {
    throw new NotFoundError(`Client with ID ${clientId} not found`);
  }
  const nutritionist = await UserRepository.findById(nutritionistId)

  if (!nutritionist) {
    throw new NotFoundError(`Nutritionist with ID ${nutritionistId} not found`);
  }

 
  const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: clientId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

     if (!clientProfile) {
      throw new Error(`Client profile not found for user ID ${clientId}`);
    }

       const nutritionistProfile = await prisma.nutritionistProfile.findUnique({
      where: { userId: nutritionistId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

     if (!nutritionistProfile) {
      throw new Error(`Nutritionist profile not found for user ID ${nutritionistId}`);
    }

  // const updatedClient = await AdminRepository.assignClientNutritionist(clientId, nutritionistId)

    const updatedClient = await prisma.clientProfile.update({
      where: { id: clientProfile.id },
      data: {
        assignedNutritionistId: nutritionistProfile.id, // ← Use assignedNutritionistId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        assignedNutritionist: { 
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        }
      }
    });

     console.log(
      `✓ Successfully assigned client ${clientProfile.user.email} ` +
      `to nutritionist ${nutritionistProfile.user.email}`
    );

  return {
    client: updatedClient,
  };
}catch(error: any) {
    console.error("[assignNutritionistToClient] Error:", error);
    throw error;
  }
}

export const getClientProfileService = async (clientId: string) => {
  const client = await ClientRepository.getClientProfile(clientId);

  if (!client) {
    throw new NotFoundError("Client not found");
  }

   const user = client.user;

    const assignedNutritionist =
    client.assignedNutritionist && client.assignedNutritionist.user
      ? {
          id: client.assignedNutritionist.id,
          name: client.assignedNutritionist.user.name || "",
          email: client.assignedNutritionist.user.email,
        }
      : null;

  return {
    client: {
      _id: user.id,
      name: user.name,
      email: user.email,
      assignedNutritionist: assignedNutritionist,
    },
    mealPlans: client.mealPlans || [],
    profile: client, 
  };
};
