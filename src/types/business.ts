export interface Business {
  id: string;
  name: string;
  category: string;
  rating: number;
  logo: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  website: string;
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  reviews: Review[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
}

export interface BusinessFilter {
  searchTerm?: string;
  category?: string;
  location?: string;
  minRating?: number;
}
