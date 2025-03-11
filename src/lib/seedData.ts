import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";
import { Business } from "../types/business";

// Function to get businesses from Firebase
export const getBusinessesFromFirebase = async (): Promise<Business[]> => {
  try {
    const businessesRef = collection(db, "businesses");
    const snapshot = await getDocs(businessesRef);

    if (snapshot.empty) {
      console.log("No businesses found in Firebase. Returning sample data.");
      return sampleBusinesses.map((business, index) => ({
        ...business,
        id: `sample-${index}`,
      }));
    }

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Business[];
  } catch (error) {
    console.error("Error getting businesses from Firebase:", error);
    // Return sample data as fallback
    return sampleBusinesses.map((business, index) => ({
      ...business,
      id: `sample-${index}`,
    }));
  }
};

// Sample business data for seeding the database
const sampleBusinesses: Omit<Business, "id">[] = [
  {
    name: "Coastal Cafe",
    category: "Restaurant",
    rating: 4.5,
    logo: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
    description:
      "A cozy cafe with ocean views and fresh local ingredients. Our menu features seasonal produce from local farms and sustainably caught seafood. We pride ourselves on our artisanal coffee program and house-made pastries. Perfect for breakfast and lunch with vegan options available.",
    address: "123 Ocean Drive",
    city: "Seaside",
    state: "CA",
    zip: "90210",
    phone: "(555) 123-4567",
    email: "info@coastalcafe.com",
    website: "https://coastalcafe.example.com",
    hours: {
      monday: "7:00 AM - 3:00 PM",
      tuesday: "7:00 AM - 3:00 PM",
      wednesday: "7:00 AM - 3:00 PM",
      thursday: "7:00 AM - 3:00 PM",
      friday: "7:00 AM - 4:00 PM",
      saturday: "8:00 AM - 4:00 PM",
      sunday: "8:00 AM - 2:00 PM",
    },
    location: {
      lat: 34.0522,
      lng: -118.2437,
    },
    reviews: [],
  },
  {
    name: "Tech Solutions",
    category: "Technology",
    rating: 4.8,
    logo: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
    description:
      "Professional IT services for small businesses. We offer computer repair, network setup, and cybersecurity solutions. Our team of certified technicians can handle everything from virus removal to complete network infrastructure design.",
    address: "456 Innovation Way",
    city: "Techville",
    state: "CA",
    zip: "90211",
    phone: "(555) 987-6543",
    email: "support@techsolutions.com",
    website: "https://techsolutions.example.com",
    hours: {
      monday: "9:00 AM - 6:00 PM",
      tuesday: "9:00 AM - 6:00 PM",
      wednesday: "9:00 AM - 6:00 PM",
      thursday: "9:00 AM - 6:00 PM",
      friday: "9:00 AM - 5:00 PM",
      saturday: "10:00 AM - 2:00 PM",
      sunday: "Closed",
    },
    location: {
      lat: 34.0523,
      lng: -118.2435,
    },
    reviews: [],
  },
  {
    name: "Green Thumb Nursery",
    category: "Garden & Landscape",
    rating: 4.2,
    logo: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80",
    description:
      "Your one-stop shop for plants, gardening supplies, and expert advice. We specialize in native and drought-resistant plants. Our knowledgeable staff can help with garden planning, plant selection, and maintenance tips.",
    address: "789 Garden Lane",
    city: "Greenfield",
    state: "CA",
    zip: "90213",
    phone: "(555) 456-7890",
    email: "hello@greenthumb.com",
    website: "https://greenthumb.example.com",
    hours: {
      monday: "8:00 AM - 5:00 PM",
      tuesday: "8:00 AM - 5:00 PM",
      wednesday: "8:00 AM - 5:00 PM",
      thursday: "8:00 AM - 5:00 PM",
      friday: "8:00 AM - 5:00 PM",
      saturday: "8:00 AM - 6:00 PM",
      sunday: "10:00 AM - 4:00 PM",
    },
    location: {
      lat: 34.0525,
      lng: -118.243,
    },
    reviews: [],
  },
  {
    name: "Fitness First",
    category: "Health & Fitness",
    rating: 4.7,
    logo: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    description:
      "Modern gym with state-of-the-art equipment, personal training, and group classes. We offer yoga, spin, and HIIT classes daily. Our certified trainers can help you achieve your fitness goals with personalized workout plans and nutrition advice.",
    address: "101 Fitness Blvd",
    city: "Healthville",
    state: "CA",
    zip: "90215",
    phone: "(555) 789-0123",
    email: "info@fitnessfirst.com",
    website: "https://fitnessfirst.example.com",
    hours: {
      monday: "5:00 AM - 10:00 PM",
      tuesday: "5:00 AM - 10:00 PM",
      wednesday: "5:00 AM - 10:00 PM",
      thursday: "5:00 AM - 10:00 PM",
      friday: "5:00 AM - 10:00 PM",
      saturday: "7:00 AM - 8:00 PM",
      sunday: "7:00 AM - 6:00 PM",
    },
    location: {
      lat: 34.052,
      lng: -118.244,
    },
    reviews: [],
  },
  {
    name: "Bookworm Haven",
    category: "Retail",
    rating: 4.9,
    logo: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80",
    description:
      "Independent bookstore with a vast selection of new and used books. We host regular author events, book clubs, and children's story times. Our knowledgeable staff provides personalized recommendations for readers of all ages.",
    address: "202 Reader's Lane",
    city: "Bookville",
    state: "CA",
    zip: "90220",
    phone: "(555) 321-7654",
    email: "books@bookwormhaven.com",
    website: "https://bookwormhaven.example.com",
    hours: {
      monday: "10:00 AM - 8:00 PM",
      tuesday: "10:00 AM - 8:00 PM",
      wednesday: "10:00 AM - 8:00 PM",
      thursday: "10:00 AM - 8:00 PM",
      friday: "10:00 AM - 9:00 PM",
      saturday: "9:00 AM - 9:00 PM",
      sunday: "11:00 AM - 6:00 PM",
    },
    location: {
      lat: 34.0518,
      lng: -118.2445,
    },
    reviews: [],
  },
  {
    name: "Paws & Claws Pet Care",
    category: "Pet Services",
    rating: 4.6,
    logo: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80",
    description:
      "Full-service pet care center offering grooming, boarding, daycare, and veterinary services. Our certified groomers and veterinary staff provide loving care for your furry family members. We also offer training classes and a retail section with premium pet supplies.",
    address: "303 Pet Paradise Road",
    city: "Petville",
    state: "CA",
    zip: "90225",
    phone: "(555) 234-5678",
    email: "care@pawsandclaws.com",
    website: "https://pawsandclaws.example.com",
    hours: {
      monday: "8:00 AM - 7:00 PM",
      tuesday: "8:00 AM - 7:00 PM",
      wednesday: "8:00 AM - 7:00 PM",
      thursday: "8:00 AM - 7:00 PM",
      friday: "8:00 AM - 7:00 PM",
      saturday: "9:00 AM - 5:00 PM",
      sunday: "10:00 AM - 4:00 PM",
    },
    location: {
      lat: 34.0515,
      lng: -118.245,
    },
    reviews: [],
  },
];

// Sample reviews data
const sampleReviews = [
  {
    businessId: "", // Will be filled in after businesses are added
    userId: "user1",
    userName: "Sarah Johnson",
    rating: 5,
    comment:
      "Absolutely love this place! The ocean view is stunning and the avocado toast is to die for. Staff is always friendly and the coffee is excellent.",
    date: new Date("2023-10-15"),
  },
  {
    businessId: "", // Will be filled in after businesses are added
    userId: "user2",
    userName: "Michael Chen",
    rating: 4,
    comment:
      "Great spot for breakfast meetings. The wifi is reliable and the atmosphere is perfect for getting work done. Only giving 4 stars because it gets pretty crowded on weekends.",
    date: new Date("2023-09-22"),
  },
  {
    businessId: "", // Will be filled in after businesses are added
    userId: "user3",
    userName: "Jessica Williams",
    rating: 5,
    comment:
      "Their vegan options are amazing! I appreciate that they clearly label allergens on their menu. The staff was very accommodating with my dietary restrictions.",
    date: new Date("2023-11-05"),
  },
  {
    businessId: "", // Will be filled in after businesses are added
    userId: "user4",
    userName: "David Rodriguez",
    rating: 5,
    comment:
      "The technicians were extremely knowledgeable and fixed my computer issues quickly. Fair pricing and excellent customer service. Highly recommend!",
    date: new Date("2023-10-10"),
  },
  {
    businessId: "", // Will be filled in after businesses are added
    userId: "user5",
    userName: "Emily Thompson",
    rating: 4,
    comment:
      "Great selection of plants and the staff was very helpful with recommendations for my garden. Prices are a bit high but the quality is worth it.",
    date: new Date("2023-11-15"),
  },
];

// Function to check if data already exists
export const checkIfDataExists = async (): Promise<boolean> => {
  const businessesRef = collection(db, "businesses");
  const snapshot = await getDocs(businessesRef);
  return !snapshot.empty;
};

// Function to seed the database with sample data
export const seedDatabase = async (): Promise<void> => {
  try {
    // Check if data already exists
    const dataExists = await checkIfDataExists();
    if (dataExists) {
      console.log("Database already contains data. Skipping seed operation.");
      return;
    }

    console.log("Seeding database with sample data...");

    // Add businesses
    const businessIds: string[] = [];
    const businessesRef = collection(db, "businesses");

    for (const business of sampleBusinesses) {
      const docRef = await addDoc(businessesRef, business);
      businessIds.push(docRef.id);
      console.log(`Added business with ID: ${docRef.id}`);
    }

    // Add reviews for the first business (Coastal Cafe)
    if (businessIds.length > 0) {
      const reviewsRef = collection(db, "reviews");

      // Assign the first three reviews to the first business
      for (let i = 0; i < 3; i++) {
        if (i < sampleReviews.length) {
          const review = { ...sampleReviews[i], businessId: businessIds[0] };
          await addDoc(reviewsRef, review);
          console.log(`Added review for business: ${businessIds[0]}`);
        }
      }

      // Add the fourth review to the second business (Tech Solutions)
      if (businessIds.length > 1 && sampleReviews.length > 3) {
        const review = { ...sampleReviews[3], businessId: businessIds[1] };
        await addDoc(reviewsRef, review);
        console.log(`Added review for business: ${businessIds[1]}`);
      }

      // Add the fifth review to the third business (Green Thumb Nursery)
      if (businessIds.length > 2 && sampleReviews.length > 4) {
        const review = { ...sampleReviews[4], businessId: businessIds[2] };
        await addDoc(reviewsRef, review);
        console.log(`Added review for business: ${businessIds[2]}`);
      }
    }

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
};
