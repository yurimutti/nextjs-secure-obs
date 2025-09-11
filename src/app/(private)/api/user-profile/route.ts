import { NextResponse } from "next/server";

// TODO: validate auth token
export function GET() {
  return NextResponse.json({
    name: "Usuário Teste",
    email: "teste@email.com",
    memberSince: "2023-01-15",
  });
}
