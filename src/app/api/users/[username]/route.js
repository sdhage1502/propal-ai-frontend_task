
import { db } from "@/lib/firebase"; // Fixed typo: firbase → firebase
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { validateSignup } from "@/utils/validation";

// Helper for error responses
const errorResponse = (error, status) => {
  console.error(`Error response: ${JSON.stringify(error, null, 2)}`);
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
};

export async function GET() {
  try {
    console.log("GET /api/users: Fetching users");
    const usersCollection = collection(db, "users");
    const snapshot = await getDocs(usersCollection);
    const users = snapshot.docs.map((doc) => doc.data());
    console.log(`GET /api/users: Fetched ${users.length} users`);
    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GET /api/users: Error:", error.message);
    return errorResponse("Failed to fetch users", 500);
  }
}

export async function POST(request) {
  try {
    console.log("POST /api/users: Processing request");
    let newUser;
    try {
      newUser = await request.json();
    } catch (e) {
      return errorResponse("Invalid JSON payload", 400);
    }
    console.log("POST /api/users: Received data", newUser);

    // Validate input
    const validationErrors = validateSignup(newUser);
    if (validationErrors) {
      console.log("POST /api/users: Validation failed", validationErrors);
      return errorResponse(validationErrors, 400);
    }

    const { username, email, phone, password } = newUser;

    // Validate Firestore document ID
    if (!username || typeof username !== "string" || /[\./]/.test(username) || username.trim() === "") {
      console.log("POST /api/users: Invalid username for Firestore", username);
      return errorResponse("Username cannot contain slashes, periods, or be empty", 400);
    }

    const usersCollection = collection(db, "users");

    // Check for duplicate username
    const snapshot = await getDocs(usersCollection);
    const users = snapshot.docs.map((doc) => doc.data());
    if (users.some((u) => u.username === username)) {
      console.log("POST /api/users: Username exists", username);
      return errorResponse("Username already exists", 400);
    }

    // Generate new ID
    const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    const userData = {
      id: newId,
      username: username.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : "",
      password: password.trim(),
    };

    // Ensure no undefined or null values
    for (const [key, value] of Object.entries(userData)) {
      if (value === undefined || value === null) {
        console.error("POST /api/users: Invalid value in userData", { key, value });
        return errorResponse(`Invalid value for field: ${key}`, 400);
      }
    }

    // Save to Firestore
    console.log("POST /api/users: Writing to Firestore", userData);
    await setDoc(doc(usersCollection, username), userData);
    console.log("POST /api/users: Added user", username);

    return new Response(JSON.stringify(userData), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("POST /api/users: Firestore Error:", {
      message: error.message,
      code: error.code,
      details: error.details || "No details provided",
    });
    if (error.code === "invalid-argument") {
      return errorResponse(`Invalid Firestore data: ${error.message}`, 400);
    }
    return errorResponse(`Failed to create user: ${error.message}`, 500);
  }
}