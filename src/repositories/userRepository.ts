import { NotFoundError } from "../errors";
import User from "../models/User";

export const UserRepository = {
    async findByEmail(email: string){ 
        const user = await User.findOne({email: email.toLowerCase()})
        return user
    },
    async findClientsByNutritionist(nutritionistId: string){
        return await User.find({nutritionist: nutritionistId})
    },
    async findById(id: string){ 
        const user = await User.findById(id);
       if(!user){
        throw new NotFoundError(`User with ID ${id} not found`)
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
    async findAllUsersByRole(role: string){
     return await User.find({role}).select("name email createdAt assignedNutritionist").sort({ createdAt: -1 });
    },
    async findLatestByRole(role: string, limit = 5){
        return await User.find({role}).sort({createdAt: -1}).limit(limit).select("name email createdAt")
    },
    async updateById(userId: string, updates: any){
        
    },
    async deleteAll(){
        return await User.deleteMany({})
    }
}