"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const kitchenSchema = new mongoose_1.default.Schema({
    location: { type: String, required: true },
    number_of_chefs: { type: Number, default: 0 },
    available_meal: [
        { type: mongoose_1.default.Schema.Types.ObjectId, ref: "AvailableMeal" },
    ],
    client_meal: { type: String },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Kitchen", kitchenSchema);
