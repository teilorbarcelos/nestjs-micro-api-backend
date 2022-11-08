import { Document } from 'mongoose';

export interface Category extends Document {
  readonly category: string;
  description: string;
  events: CategoryEvent[];
}

export interface CategoryEvent {
  name: string;
  operation: string;
  value: number;
}
