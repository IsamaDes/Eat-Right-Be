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
