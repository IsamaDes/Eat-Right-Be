"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            console.log("Role not allowed");
            return res.status(403).json({
                message: "Access denied",
                yourRole: req.user.role,
                allowedRoles: allowedRoles
            });
        }
        console.log("Role authorized");
        next();
    };
};
exports.default = authorizeRoles;
