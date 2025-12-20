"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.layoutRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const layoutController_1 = require("../controllers/layoutController");
exports.layoutRouter = express_1.default.Router();
exports.layoutRouter.post("/create-layout", auth_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.validateUserRole)("admin"), layoutController_1.createLayout);
exports.layoutRouter.put("/edit-layout", auth_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.validateUserRole)("admin"), layoutController_1.editLayout);
exports.layoutRouter.get("/get-layout/:type", layoutController_1.getLayoutByType);
