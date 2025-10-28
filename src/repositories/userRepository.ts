import User from "../models/User";

export const UserRepository = {
    async findByEmail(email: string){ return await User.findOne({email: email.toLowerCase()})},
    async findClientsByNutritionist(nutritionistId: string){
        return await User.find({nutritionist: nutritionistId})
    },
    async findById(id: string){ 
        const user = await User.findById(id);
       if(!user){
        throw new Error(`User with ID ${id} not found`)
       }
       return user
    },
    async save(user: any){
        return await user.save()
    },
    async create(userData: any){
        const user = new User(userData);
        return await user.save()
    },

    async countByRole(role: string){
        return await User.countDocuments({role});
    },
    async findLatestByRole(role: string, limit = 5){
        return await User.find({role}).sort({createdAt: -1}).limit(limit).select("name, email, createdAt")
    }
}