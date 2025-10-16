import mongoose from "mongoose"


export interface IBlacklistedToken extends Document {
  token: string;
  expiresAt: Date;
}

const blacklistedTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
});

blacklistedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // auto-delete expired tokens

export default mongoose.model<IBlacklistedToken>("BlacklistedToken", blacklistedTokenSchema);
