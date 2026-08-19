export interface Testimonial {
  id: number;
  name: string;
  designation: string;
  company: string;
  description: string;
  image: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TestimonialPayload {
  name: string;
  designation: string;
  company: string;
  description: string;
  image: string;
}

export interface TestimonialPositionItem {
  id: number;
  order: number;
}

export interface UpdateTestimonialPositionPayload {
  positions: TestimonialPositionItem[];
}