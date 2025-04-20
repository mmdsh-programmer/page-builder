import { type NextRequest, NextResponse } from 'next/server'
import fs from "fs";
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  const data = await request.json();
  
  fs.writeFileSync(process.cwd() + "/database.text", JSON.stringify(data.data));
  revalidatePath("/static");
  return NextResponse.json({ data });
}

export async function GET() {
  const data = fs.readFileSync(process.cwd() + "/database.text", "utf8");
  return NextResponse.json({ ...JSON.parse(data) });
}
