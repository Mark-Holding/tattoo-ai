export interface Project {
  id: string;
  name: string;
  createdAt: Date;
  images: string[]; // Array of image paths/urls
  userId: string; // To associate projects with users
} 