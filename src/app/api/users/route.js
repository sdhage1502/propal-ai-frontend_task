import { db } from "../../../lib/firbase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { validateSignup } from "@/utils/validation";

const errorResponse = (error, status) =>
  new Response(JSON.stringify({ error }), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export async function GET() {
  try {
    const usersCollection = collection(db, "users");
    const snapshot = await getDocs(usersCollection);
    const users = snapshot.docs.map((doc) => doc.data());

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return errorResponse("Failed to fetch users", 500);
  }
}

export async function POST(request) {
  try {
    let newUser;

    try {
      newUser = await request.json();
    } catch {
      return errorResponse("Invalid JSON payload", 400);
    }

    const validationErrors = validateSignup(newUser);
    if (validationErrors) {
      return errorResponse(validationErrors, 400);
    }

    const { username, email, phone, password } = newUser;

    if (!username || typeof username !== "string" || /[./]/.test(username.trim()) || username.trim() === "") {
      return errorResponse("Username cannot contain slashes, periods, or be empty", 400);
    }

    const usersCollection = collection(db, "users");
    const snapshot = await getDocs(usersCollection);
    const users = snapshot.docs.map((doc) => doc.data());

    if (users.some((u) => u.username === username)) {
      return errorResponse("Username already exists", 400);
    }

    const newId = users.length > 0 ? Math.max(...users.map((u) => u.id || 0)) + 1 : 1;

    const userData = {
      id: newId,
      username: username.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : "",
      password: password.trim(),
    };

    for (const [key, value] of Object.entries(userData)) {
      if (value === undefined || value === null) {
        return errorResponse(`Invalid value for field: ${key}`, 400);
      }
    }

    await setDoc(doc(usersCollection, username), userData);

    return new Response(JSON.stringify(userData), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return errorResponse("Failed to create user", 500);
  }
}
