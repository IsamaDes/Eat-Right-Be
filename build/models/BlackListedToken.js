"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoosePkg = require("mongoose");
const mongoose = mongoosePkg;
const blacklistedTokenSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
});
blacklistedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // auto-delete expired tokens
exports.default = mongoose.model("BlacklistedToken", blacklistedTokenSchema);
