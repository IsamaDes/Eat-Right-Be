import User from "../models/User.js";

export const UserRepository = {
    async findByEmail(email: string){ return await User.findOne({email: email.toLowerCase()})},
    async findById(id: string){ return await User.findById(id)},
    async save(user: any){
        return await user.save()
    },
    async create(userData: any){
        const user = new User(userData);
        return await user.save()
    },
    async createBlacklistedToken(refreshToken: string, expiresAt: Date){
       const user = new User({token: refreshToken, expiresAt})
       return await user.save();
    },
    async findByRefreshToken(refreshToken: string){
        return await User.findOne({refreshToken});
    }
}