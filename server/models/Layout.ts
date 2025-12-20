import { Document, model, Schema } from "mongoose";

interface FAQItem extends Document {
  question: string;
  answer: string;
}

interface Category extends Document {
  title: string;
}

interface BannerImage extends Document {
  public_id: string;
  url: string;
}

interface Layout extends Document {
  type: string;
  faq?: FAQItem[];
  categories?: Category[];
  banner?: {
    image: BannerImage;
    title: string;
    subTitle: string;
  };
}

const faqSchema = new Schema<FAQItem>({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  }
});

const categorySchema = new Schema<Category>({
  title: {
    type: String,
    required: true
  }
});

const bannerImageSchema = new Schema<BannerImage>({
  public_id: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
});

const layoutSchema = new Schema<Layout>({
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

export const Layout = model<Layout>("Layout", layoutSchema);