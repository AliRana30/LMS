import mongoose, { Document, Model, Schema } from "mongoose"
import { IUser } from "./User";


interface IComment extends Document {
    user: IUser;
    question: string;
    questionReplies: object[]
}

interface IReview extends Document {
    user: IUser;
    rating: number;
    comment: string;
    commentReplies: IComment[]
}

interface ILink extends Document {
    title: string
    url: string;
}

interface ICourseData extends Document {
    title: string;
    description: string;
    videoUrl: string;
    videoThumbnail: string;
    videoSection: string
    videoLength: string;
    videoPlayer: string;
    links: ILink[];
    suggestion: string
    questions: IComment[];
}

interface ICourse extends Document {
    name: string;
    description: string;
    categories : string;
    price: number;
    estimatedPrice: string;
    thumbnail: string;
    tags: string;
    level: string;
    demoUrl: string;
    benefits: { title: string }[];
    reviews: IReview[];
    courseData: ICourseData[];
    ratings: number;
    prerequisites: { title: string }[];
    purchased: number;
}

const reviewSchema = new Schema<IReview>({
    user: Object,
    rating: {
        type: Number,
        default: 0
    },
    comment: String,
    commentReplies : [Object]
},{timestamps: true} )

const linkSchema = new Schema<ILink>({
    title: String,
    url: String
})


const commentSchema = new Schema<IComment>({
    user: Object,
    question: String,
    questionReplies: [Object]
},{timestamps: true})

const courseDataSchema = new Schema<ICourseData>({
    title: String,
    description: String,
    videoUrl: String,
    videoThumbnail: String,
    videoLength: String,
    videoSection: String,
    videoPlayer: String,
    links: [linkSchema],
    suggestion: String,
    questions: [commentSchema]
})

const courseSchema = new Schema<ICourse>({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    categories :{
        type: String,
        required: false
    },
    price : {
        type: Number,
        required: true
    },
    estimatedPrice: {
        type: String,
    },
    thumbnail: {
        public_id: {
            required : false,
            type : String
        },
        url : {
            required : false,
            type : String
        }
    },
    tags: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    demoUrl: {
        type: String,
        required: true
    },
    benefits: [
        { title: String }   
    ],
    prerequisites: [
        { title: String }
    ],
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    ratings: {
        type: Number,
        default: 0
    },
    purchased: {
        type: Number,
        default: 0
    }
}, { timestamps: true })        

export const Course : Model<ICourse> = mongoose.model("Course", courseSchema);