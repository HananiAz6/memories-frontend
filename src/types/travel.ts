export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  homeBase: string;
  travelStyle: string;
  totalTrips: number;
  countriesVisited: number;
  joinedDate: string;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  activities: string[];
  budgetEstimate?: string;
  tips?: string;
}

export interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  text: string;
  createdAt: string;
}

export interface TravelMemory {
  id: string;
  title: string;
  description: string;
  photoUrl: string;
  photoCaption?: string;
  location: string;
  country: string;
  travelStyle: string;
  tags: string[];
  author: {
    id: string;
    name: string;
    avatar: string;
    email: string;
  };
  createdAt: string;
  likes: string[];
  comments: Comment[];
  itinerary?: ItineraryDay[];
  isOfflineCached?: boolean;
  isPendingSync?: boolean;
  savedBy?: string[];
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'new_trip' | 'sync';
  actor: {
    name: string;
    avatar: string;
  };
  memoryId: string;
  memoryTitle: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface FilterOptions {
  destination: string;
  travelStyle: string;
  tag: string;
  searchQuery: string;
}
