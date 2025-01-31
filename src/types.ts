export interface Place {
  id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  location_key: string;
  rating: number;
  type: 'default' | 'popular' | 'inspiration';
}

export interface Admin {
  email: string;
  password: string;
}


export interface User {
  id: string;
  email: string;
  name: string;
  npm: string;
  createdAt?: Date; // Make optional
  favorites?: Record<string, Omit<Place, 'description' | 'location_key' | 'rating'>>;
}