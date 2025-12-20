"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const analyticsController_1 = require("../controllers/analyticsController");
exports.analyticsRouter = express_1.default.Router();
exports.analyticsRouter.get("/get-users-analytics", auth_1.isAuthenticated, (0, auth_1.validateUserRole)("admin"), analyticsController_1.getUsersAnalytics);
exports.analyticsRouter.get("/get-courses-analytics", auth_1.isAuthenticated, (0, auth_1.validateUserRole)("admin"), analyticsController_1.getCoursesAnalytics);
exports.analyticsRouter.get("/get-orders-analytics", auth_1.isAuthenticated, (0, auth_1.validateUserRole)("admin"), analyticsController_1.getOrdersAnalytics);
