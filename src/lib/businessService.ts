import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { Business, BusinessFilter, Review } from "../types/business";
import { getBusinessesFromFirebase } from "./seedData";

const BUSINESSES_COLLECTION = "businesses";
const REVIEWS_COLLECTION = "reviews";
const FAVORITES_COLLECTION = "favorites";

export const getBusinesses = async (
  filters?: BusinessFilter,
): Promise<Business[]> => {
  try {
    // First try to get businesses from Firebase
    let businesses: Business[] = [];

    try {
      businesses = await getBusinessesFromFirebase();
    } catch (firebaseError) {
      console.error("Error getting businesses from Firebase:", firebaseError);
      // Will continue with empty array and handle below
    }

    // If no businesses were found or there was an error, return empty array
    if (businesses.length === 0) {
      console.warn("No businesses found in database");
      return [];
    }

    // Apply filters to the businesses
    let filteredBusinesses = [...businesses];

    if (filters) {
      // Filter by search term
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredBusinesses = filteredBusinesses.filter(
          (business) =>
            business.name.toLowerCase().includes(searchLower) ||
            business.description.toLowerCase().includes(searchLower),
        );
      }

      // Filter by category
      if (filters.category) {
        filteredBusinesses = filteredBusinesses.filter(
          (business) => business.category === filters.category,
        );
      }

      // Filter by location (city)
      if (filters.location) {
        filteredBusinesses = filteredBusinesses.filter(
          (business) => business.city === filters.location,
        );
      }

      // Filter by minimum rating
      if (filters.minRating) {
        filteredBusinesses = filteredBusinesses.filter(
          (business) => business.rating >= filters.minRating,
        );
      }
    }

    return filteredBusinesses;
  } catch (error) {
    console.error("Error getting businesses:", error);
    return []; // Return empty array instead of throwing
  }
};

export const getBusinessById = async (id: string): Promise<Business | null> => {
  try {
    const docRef = doc(db, BUSINESSES_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      // Ensure all required fields exist
      const business = {
        id: docSnap.id,
        name: data.name || "",
        category: data.category || "Uncategorized",
        rating: data.rating || 0,
        logo: data.logo || "",
        description: data.description || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        zip: data.zip || "",
        phone: data.phone || "",
        email: data.email || "",
        website: data.website || "",
        hours: data.hours || {
          monday: "Closed",
          tuesday: "Closed",
          wednesday: "Closed",
          thursday: "Closed",
          friday: "Closed",
          saturday: "Closed",
          sunday: "Closed",
        },
        location: data.location || { lat: 0, lng: 0 },
        reviews: data.reviews || [],
      } as Business;

      return business;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting business:", error);
    throw error;
  }
};

export const getBusinessReviews = async (
  businessId: string,
): Promise<Review[]> => {
  try {
    console.log("Getting reviews for business ID:", businessId);

    // Intentamos obtener reviews de Firestore
    const reviewsRef = collection(db, REVIEWS_COLLECTION);
    const reviewsQuery = query(
      reviewsRef,
      where("businessId", "==", businessId),
    );

    console.log("Executing Firestore query...");
    const querySnapshot = await getDocs(reviewsQuery);
    console.log("Query complete, found", querySnapshot.size, "reviews");

    // Si hay reviews en Firestore, las devolvemos
    if (!querySnapshot.empty) {
      const reviews = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        // Handle potential date conversion issues
        let reviewDate: Date;
        try {
          reviewDate = data.date?.toDate() || new Date();
        } catch (e) {
          console.warn("Error converting date, using current date", e);
          reviewDate = new Date();
        }

        return {
          id: doc.id,
          userId: data.userId || "",
          userName: data.userName || "Anonymous",
          rating: data.rating || 0,
          comment: data.comment || "",
          date: reviewDate,
        } as Review;
      });

      console.log("Returning", reviews.length, "reviews from Firestore");
      return reviews;
    }

    // Si no hay reviews en Firestore, devolvemos datos de ejemplo
    console.log("No reviews found in Firestore, returning sample data");
    return [
      {
        id: "sample1",
        userId: "user1",
        userName: "Sarah Johnson",
        rating: 5,
        comment:
          "Absolutely love this place! The service is excellent and the atmosphere is perfect.",
        date: new Date("2023-10-15"),
      },
      {
        id: "sample2",
        userId: "user2",
        userName: "Michael Chen",
        rating: 4,
        comment:
          "Great experience overall. Would definitely recommend to others looking for quality service.",
        date: new Date("2023-09-22"),
      },
      {
        id: "sample3",
        userId: "user3",
        userName: "Jessica Williams",
        rating: 5,
        comment:
          "Exceptional service and attention to detail. The staff was very accommodating with my requests.",
        date: new Date("2023-11-05"),
      },
    ];
  } catch (error) {
    console.error("Error getting reviews:", error);
    // En caso de error, devolvemos datos de ejemplo
    return [
      {
        id: "sample1",
        userId: "user1",
        userName: "Sarah Johnson",
        rating: 5,
        comment:
          "Absolutely love this place! The service is excellent and the atmosphere is perfect.",
        date: new Date("2023-10-15"),
      },
      {
        id: "sample2",
        userId: "user2",
        userName: "Michael Chen",
        rating: 4,
        comment:
          "Great experience overall. Would definitely recommend to others looking for quality service.",
        date: new Date("2023-09-22"),
      },
    ];
  }
};

export const addReview = async (
  businessId: string,
  review: Omit<Review, "id">,
): Promise<string> => {
  try {
    const reviewRef = await addDoc(collection(db, REVIEWS_COLLECTION), {
      ...review,
      businessId,
      date: new Date(),
    });

    // Update business average rating
    await updateBusinessRating(businessId);

    return reviewRef.id;
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};

const updateBusinessRating = async (businessId: string): Promise<void> => {
  try {
    const reviews = await getBusinessReviews(businessId);

    if (reviews.length === 0) return;

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    const businessRef = doc(db, BUSINESSES_COLLECTION, businessId);
    await updateDoc(businessRef, {
      rating: averageRating,
    });
  } catch (error) {
    console.error("Error updating business rating:", error);
    throw error;
  }
};

export const addToFavorites = async (
  userId: string,
  businessId: string,
): Promise<string> => {
  try {
    const favoriteRef = await addDoc(collection(db, FAVORITES_COLLECTION), {
      userId,
      businessId,
      createdAt: new Date(),
    });

    return favoriteRef.id;
  } catch (error) {
    console.error("Error adding to favorites:", error);
    throw error;
  }
};

export const removeFromFavorites = async (
  favoriteId: string,
): Promise<void> => {
  try {
    await deleteDoc(doc(db, FAVORITES_COLLECTION, favoriteId));
  } catch (error) {
    console.error("Error removing from favorites:", error);
    throw error;
  }
};

export const getUserFavorites = async (userId: string): Promise<string[]> => {
  try {
    const favoritesQuery = query(
      collection(db, FAVORITES_COLLECTION),
      where("userId", "==", userId),
    );

    const querySnapshot = await getDocs(favoritesQuery);

    return querySnapshot.docs.map((doc) => doc.data().businessId as string);
  } catch (error) {
    console.error("Error getting user favorites:", error);
    return []; // Return empty array instead of throwing to prevent UI errors
  }
};

export const getUserFavoriteDocuments = async (
  userId: string,
): Promise<{ id: string; businessId: string }[]> => {
  try {
    const favoritesQuery = query(
      collection(db, FAVORITES_COLLECTION),
      where("userId", "==", userId),
    );

    const querySnapshot = await getDocs(favoritesQuery);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      businessId: doc.data().businessId as string,
    }));
  } catch (error) {
    console.error("Error getting user favorite documents:", error);
    return []; // Return empty array instead of throwing
  }
};

export const getFavoriteBusinesses = async (
  userId: string,
): Promise<Business[]> => {
  try {
    const favoriteIds = await getUserFavorites(userId);

    if (favoriteIds.length === 0) return [];

    const businesses: Business[] = [];

    for (const id of favoriteIds) {
      const business = await getBusinessById(id);
      if (business) businesses.push(business);
    }

    return businesses;
  } catch (error) {
    console.error("Error getting favorite businesses:", error);
    throw error;
  }
};
