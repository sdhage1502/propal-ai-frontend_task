import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Path to the users.json file in the public directory (read-only)
const publicFilePath = path.join(process.cwd(), "public", "users.json");
// Path to the users.json file in the /tmp directory (writable in Vercel)
const tmpFilePath = path.join("/tmp", "users.json");

// Helper function to ensure the file exists in /tmp
async function ensureFileExists() {
  try {
    // Check if the file exists in /tmp
    await fs.access(tmpFilePath);
  } catch (error) {
    // If the file doesn't exist in /tmp, copy it from public
    try {
      const data = await fs.readFile(publicFilePath, "utf-8");
      await fs.writeFile(tmpFilePath, data);
    } catch (publicError) {
      throw new Error(`Failed to copy users.json from public to /tmp: ${publicError.message}`);
    }
  }
}

export async function GET() {
  try {
    // Ensure the file exists in /tmp
    await ensureFileExists();

    const data = await fs.readFile(tmpFilePath, "utf-8");
    const users = JSON.parse(data);
    return NextResponse.json(users);
  } catch (error) {
    console.error("GET /api/users error:", error.message);
    return NextResponse.json(
      { message: `Error fetching users: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Ensure the file exists in /tmp
    await ensureFileExists();

    const body = await request.json();

    if (Array.isArray(body)) {
      // Handle profile update (array of users)
      // Basic validation: Ensure the array contains valid user objects
      if (!body.every(user => user.username && user.email && user.password)) {
        return NextResponse.json(
          { message: "Invalid user data: Each user must have username, email, and password" },
          { status: 400 }
        );
      }

      await fs.writeFile(tmpFilePath, JSON.stringify(body, null, 2));
      return NextResponse.json({ message: "Users updated successfully" });
    } else {
      // Handle signup (single user)
      // Basic validation
      if (!body.username || !body.email || !body.password) {
        return NextResponse.json(
          { message: "Missing required fields: username, email, and password are required" },
          { status: 400 }
        );
      }

      const data = await fs.readFile(tmpFilePath, "utf-8");
      const users = JSON.parse(data);

      const userExists = users.some(
        (user) => user.username === body.username || user.email === body.email
      );

      if (userExists) {
        return NextResponse.json({ message: "User already exists" }, { status: 400 });
      }

      users.push(body);
      await fs.writeFile(tmpFilePath, JSON.stringify(users, null, 2));
      return NextResponse.json({ message: "User created successfully" });
    }
  } catch (error) {
    console.error("POST /api/users error:", error.message);
    return NextResponse.json(
      { message: `Error processing request: ${error.message}` },
      { status: 500 }
    );
  }
}