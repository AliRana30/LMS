import { NextFunction, Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors";
import ErrorHandler from "../utlis/errorHandler";
import { Layout } from "../models/Layout";
import cloudinary from "cloudinary";

// create layout

export const createLayout = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;

      // Check if layout type already exists
      const isTypeExist = await Layout.findOne({ type });
      if (isTypeExist) {
        return next(new ErrorHandler(`${type} already exists`, 400));
      }

      // For creating banner
      if (type === "Banner") {
        const { image, title, subTitle } = req.body;

        const myCloud = await cloudinary.v2.uploader.upload(image, {
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

        await Layout.create(banner);
      }

      // For creating FAQ
      if (type === "FAQ") {
        const { faq } = req.body;
        const faqItems = faq.map((item: any) => ({
          question: item.question,
          answer: item.answer
        }));

        await Layout.create({ type: "FAQ", faq: faqItems });
      }

      // For creating categories
      if (type === "Categories") {
        const { categories } = req.body;
        const categoryItems = categories.map((item: any) => ({
          title: item.title
        }));

        await Layout.create({ type: "Categories", categories: categoryItems });
      }

      res.status(201).json({
        success: true,
        message: "Layout created successfully"
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// edit layout

export const editLayout = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;

      // For updating banner
      if (type === "Banner") {
        const bannerData: any = await Layout.findOne({ type: "Banner" });

        const { image, title, subTitle } = req.body;

        if (bannerData) {
          // Delete old image from cloudinary
          await cloudinary.v2.uploader.destroy(bannerData.banner.image.public_id);
        }

        // Upload new image
        const myCloud = await cloudinary.v2.uploader.upload(image, {
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

        await Layout.findByIdAndUpdate(bannerData._id, banner);
      }

      // For updating FAQ
      if (type === "FAQ") {
        const { faq } = req.body;
        const faqData = await Layout.findOne({ type: "FAQ" });

        const faqItems = faq.map((item: any) => ({
          question: item.question,
          answer: item.answer
        }));

        await Layout.findByIdAndUpdate(faqData?._id, {
          type: "FAQ",
          faq: faqItems
        });
      }

      // For updating categories
      if (type === "Categories") {
        const { categories } = req.body;
        const categoryData = await Layout.findOne({ type: "Categories" });

        const categoryItems = categories.map((item: any) => ({
          title: item.title
        }));

        await Layout.findByIdAndUpdate(categoryData?._id, {
          type: "Categories",
          categories: categoryItems
        });
      }

      res.status(200).json({
        success: true,
        message: "Layout updated successfully"
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get layout by type

export const getLayoutByType = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
     try {

         const {type} = req.params
         const layout = await Layout.findOne({type})

         res.status(200).json({
            success : true,
            message : "Layout fetched successully",
            layout
         })
     } catch (error) {
        return next(new ErrorHandler((error as Error).message , 400))
     }
}) 