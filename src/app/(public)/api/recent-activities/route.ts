import { NextResponse } from "next/server";

// TODO: validate auth token
export function GET() {
  return NextResponse.json([
    { id: 1, action: "Fez login" },
    {
      id: 2,
      action: "Atualizou perfil",
    },
  ]);
}
