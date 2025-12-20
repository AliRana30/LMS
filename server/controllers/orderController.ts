require('dotenv').config()
import { Request, Response, NextFunction } from "express";
import { sendMail } from "../utlis/sendMail";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors";
import ErrorHandler from "../utlis/errorHandler";
import { IOrder, Order } from "../models/Order";
import { User } from "../models/User";
import { Course } from "../models/Course";
import { getAllOrdersService, newOrder } from "../services/orderService";
import { Notification } from "../models/Notification";
import redis from "../utlis/redis"
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


// create order

export const createOrder = catchAsyncErrors(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId, payment_info } = req.body as IOrder;
        const userId = req.user?._id; 

        if(payment_info){
            if("id" in payment_info){
                const paymentIntent = await stripe.paymentIntents.retrieve(payment_info.id);
                if(paymentIntent.status !== "succeeded"){
                    return next(new ErrorHandler("Payment not successful", 400));
                }
            }
        }

        const user = await User.findById(userId);

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        const courseExists = user.courses?.find((course: any) => 
            course._id.toString() === courseId.toString()
        );

        if (courseExists) {
            return next(new ErrorHandler("You have already purchased this course", 400));
        }

        const course: any = await Course.findById(courseId);

        if (!course) {
            return next(new ErrorHandler("Course doesn't exist", 400));
        }

        const data: any = {
            courseId: course._id,
            userId: user._id,
            payment_info
        };

        // Create the order
        const order : any = await Order.create(data);
        
        const mailData = {
            order: {
                _id: order?._id.toString().slice(0, 6),
                name: course.name,
                price: course.price,
                date: new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                })
            }
        };

        // Send email
        try {
            await sendMail({
                email: user.email,
                subject: "Order Confirmation - CampusCore",
                template: "order-confirmation.ejs",
                data: mailData
            });
        } catch (error: any) {
            console.error("Email sending failed:", error.message);
        }

        // Add course to user's courses
        user.courses.push(course._id);

        await redis.set(req.user?._id, JSON.stringify(user));
        await user.save();
        
        // Create notification
        await Notification.create({
            user: user._id,
            title: "New Order",
            message: `${user.name} have successfully purchased ${course.name}`
        });
        
        course.purchased = (course.purchased || 0) + 1;
        await course.save();

        // FIXED: Send response directly and return
        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            order: {
                _id: order._id,
                courseId: course._id,
                courseName: course.name,
                price: course.price,
                userId: user._id
            }
        });

    } catch (error: any) {
        console.error("Order creation error:", error);
        return next(new ErrorHandler(error.message, 500));
    }
});

// get all orders --only admin

export const getAllOrdersAdmin = catchAsyncErrors(async(req:Request,res:Response,next:NextFunction)=>{
   try {
    getAllOrdersService(res)
   } catch (error : any) {
      return next(new ErrorHandler(error.message , 400))
   }
})

// send stripe publishable key
export const sendStripePublishableKey = catchAsyncErrors(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
        res.status(200).json({
            success: true,
            publishableKey
        });
    } catch (error: any) {   
        return next(new ErrorHandler(error.message, 400));
    }
});

// new payment
export const newPayment = catchAsyncErrors(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const payment = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: "usd",
            metadata: { company: "CampusCore" },
            automatic_payment_methods: { enabled: true },
        });
        
        res.status(200).json({
            success: true,
            client_secret: payment.client_secret
        }); 
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});