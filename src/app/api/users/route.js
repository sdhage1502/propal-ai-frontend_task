import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "public", "users.json");

export async function POST(request) {
  try {
    const newUser = await request.json();
    const fileData = await fs.readFile(filePath, "utf-8");
    const users = JSON.parse(fileData || "[]");
    if (users.find((u) => u.email === newUser.email)) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }
    users.push(newUser);
    await fs.writeFile(filePath, JSON.stringify(users, null, 2));
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const fileData = await fs.readFile(filePath, "utf-8");
    const users = JSON.parse(fileData || "[]");
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}