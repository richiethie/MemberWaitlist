export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string; // Should be handled securely (e.g., never exposed in frontend)
    membership: "Free" | "Bronze" | "Silver" | "Gold"; // Enum for membership tiers
    preferredBarber: string;
    drinkOfChoice: string;
    isOfLegalDrinkingAge: boolean;
    appointments: string[]; // Array of appointment IDs (references)
    phoneNumber: string;
    photoId?: {  // Matches the backend schema structure for photoId
        data: Buffer;  // Storing as buffer on the backend
        contentType: string;  // Content type for the image (e.g., "image/jpeg")
        fileName: string;  // Name of the file
    } | null; // Optional field, can be null
    verifiedId: boolean; // Matches the backend field
    isAdmin: boolean; // Matches the backend field
    createdAt: string; // Timestamp of creation (if needed in frontend)
    updatedAt: string; // Timestamp of last update (if needed in frontend)
    dob: string; // Assuming date of birth is stored as a string (e.g., "YYYY-MM-DD")
    wantsDrink: boolean; // Matches the schema logic for drink preference
    checkInTime: string;
    paymentStatus: "active" | "past_due" | "cancelled";
}
