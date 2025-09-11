import { verifySession } from "@/shared/libs/dal";
import { NextResponse } from "next/server";

// TODO: validate auth token
export async function GET() {
  const session = await verifySession();
  if (!session) return null;

  return NextResponse.json({
    name: "Usuário Teste",
    email: "teste@email.com",
    memberSince: "2023-01-15",
  });
}
