import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "public", "users.json");

export async function GET() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const users = JSON.parse(data);
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching users" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (Array.isArray(body)) {
      // Handle profile update (array of users)
      await fs.writeFile(filePath, JSON.stringify(body, null, 2));
      return NextResponse.json({ message: "Users updated successfully" });
    } else {
      // Handle signup (single user)
      const data = await fs.readFile(filePath, "utf-8");
      const users = JSON.parse(data);

      const userExists = users.some(
        (user) => user.username === body.username || user.email === body.email
      );

      if (userExists) {
        return NextResponse.json({ message: "User already exists" }, { status: 400 });
      }

      users.push(body);
      await fs.writeFile(filePath, JSON.stringify(users, null, 2));
      return NextResponse.json({ message: "User created successfully" });
    }
  } catch (error) {
    return NextResponse.json({ message: "Error processing request" }, { status: 500 });
  }
}