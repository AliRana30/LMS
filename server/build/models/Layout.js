"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Layout = void 0;
const mongoose_1 = require("mongoose");
const faqSchema = new mongoose_1.Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
});
const categorySchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true
    }
});
const bannerImageSchema = new mongoose_1.Schema({
    public_id: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
});
const layoutSchema = new mongoose_1.Schema({
    type: {
        type: String,
        required: true,
        enum: ["Banner", "FAQ", "Categories"]
    },
    faq: [faqSchema],
    categories: [categorySchema],
    banner: {
        image: bannerImageSchema,
        title: {
            type: String
        },
        subTitle: {
            type: String
        }
    }
});
exports.Layout = (0, mongoose_1.model)("Layout", layoutSchema);
