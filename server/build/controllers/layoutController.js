"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLayoutByType = exports.editLayout = exports.createLayout = void 0;
const catchAsyncErrors_1 = require("../middlewares/catchAsyncErrors");
const errorHandler_1 = __importDefault(require("../utlis/errorHandler"));
const Layout_1 = require("../models/Layout");
const cloudinary_1 = __importDefault(require("cloudinary"));
// create layout
exports.createLayout = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    try {
        const { type } = req.body;
        // Check if layout type already exists
        const isTypeExist = await Layout_1.Layout.findOne({ type });
        if (isTypeExist) {
            return next(new errorHandler_1.default(`${type} already exists`, 400));
        }
        // For creating banner
        if (type === "Banner") {
            const { image, title, subTitle } = req.body;
            const myCloud = await cloudinary_1.default.v2.uploader.upload(image, {
                folder: "layout"
            });
            const banner = {
                type: "Banner",
                banner: {
                    image: {
                        public_id: myCloud.public_id,
                        url: myCloud.secure_url
                    },
                    title,
                    subTitle
                }
            };
            await Layout_1.Layout.create(banner);
        }
        // For creating FAQ
        if (type === "FAQ") {
            const { faq } = req.body;
            const faqItems = faq.map((item) => ({
                question: item.question,
                answer: item.answer
            }));
            await Layout_1.Layout.create({ type: "FAQ", faq: faqItems });
        }
        // For creating categories
        if (type === "Categories") {
            const { categories } = req.body;
            const categoryItems = categories.map((item) => ({
                title: item.title
            }));
            await Layout_1.Layout.create({ type: "Categories", categories: categoryItems });
        }
        res.status(201).json({
            success: true,
            message: "Layout created successfully"
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 500));
    }
});
// edit layout
exports.editLayout = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    try {
        const { type } = req.body;
        // For updating banner
        if (type === "Banner") {
            const bannerData = await Layout_1.Layout.findOne({ type: "Banner" });
            const { image, title, subTitle } = req.body;
            if (bannerData) {
                // Delete old image from cloudinary
                await cloudinary_1.default.v2.uploader.destroy(bannerData.banner.image.public_id);
            }
            // Upload new image
            const myCloud = await cloudinary_1.default.v2.uploader.upload(image, {
                folder: "layout"
            });
            const data = image.startsWith("https") ? bannerData : {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            };
            const banner = {
                type: "Banner",
                banner: {
                    image: {
                        public_id: image.startsWith("https") ? bannerData.banner.image.public_id : data?.public_id,
                        url: image.startsWith("https") ? bannerData.banner.image.url : data?.url
                    },
                    title,
                    subTitle
                }
            };
            await Layout_1.Layout.findByIdAndUpdate(bannerData._id, banner);
        }
        // For updating FAQ
        if (type === "FAQ") {
            const { faq } = req.body;
            const faqData = await Layout_1.Layout.findOne({ type: "FAQ" });
            const faqItems = faq.map((item) => ({
                question: item.question,
                answer: item.answer
            }));
            await Layout_1.Layout.findByIdAndUpdate(faqData?._id, {
                type: "FAQ",
                faq: faqItems
            });
        }
        // For updating categories
        if (type === "Categories") {
            const { categories } = req.body;
            const categoryData = await Layout_1.Layout.findOne({ type: "Categories" });
            const categoryItems = categories.map((item) => ({
                title: item.title
            }));
            await Layout_1.Layout.findByIdAndUpdate(categoryData?._id, {
                type: "Categories",
                categories: categoryItems
            });
        }
        res.status(200).json({
            success: true,
            message: "Layout updated successfully"
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 500));
    }
});
// get layout by type
exports.getLayoutByType = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    try {
        const { type } = req.params;
        const layout = await Layout_1.Layout.findOne({ type });
        res.status(200).json({
            success: true,
            message: "Layout fetched successully",
            layout
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
