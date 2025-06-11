import { db } from "@/lib/firbase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { validateProfileUpdate } from "@/utils/validation";

const errorResponse = (error, status = 400) =>
  new Response(JSON.stringify({ error }), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export async function PUT(request, context) {
  try {
   const { username } = await context.params; 

    if (!username || typeof username !== "string" || /[./]/.test(username.trim())) {
      return errorResponse("Invalid username");
    }

    const body = await request.json();

    const validationErrors = validateProfileUpdate({
      email: body.email,
      oldPassword: body.oldPassword || "",
      newPassword: body.newPassword || "",
    });

    if (validationErrors) {
      return errorResponse(validationErrors, 400);
    }

    const userRef = doc(db, "users", username);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return errorResponse("User not found", 404);
    }

    const currentUser = userSnap.data();

    if (body.oldPassword && body.oldPassword !== currentUser.password) {
      return errorResponse("Incorrect old password", 400);
    }

    const updatedUser = {
      id: currentUser.id,
      username: currentUser.username,
      email: body.email.trim(),
      password: body.newPassword ? body.newPassword.trim() : currentUser.password,
    };

    await setDoc(userRef, updatedUser);

    return new Response(JSON.stringify({ user: updatedUser }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return errorResponse("Failed to update user", 500);
  }
}
