"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const notificationController_1 = require("../controllers/notificationController");
exports.notificationRouter = express_1.default.Router();
exports.notificationRouter.get("/get-all-notifications", auth_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.validateUserRole)("admin"), notificationController_1.getNotifications);
exports.notificationRouter.put("/update-notification/:id", auth_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.validateUserRole)("admin"), notificationController_1.updateNotification);
