import { NextResponse } from "next/server";

const REQUIRED_FIELDS = ["name", "email", "reason", "acceptsTerms"] as const;

export async function POST(request: Request) {
  const payload = await request.json();
  const missingField = REQUIRED_FIELDS.find((field) => !payload?.[field]);

  if (missingField) {
    return NextResponse.json(
      { message: `El campo ${missingField} es obligatorio.` },
      { status: 400 }
    );
  }

  // TODO: Persistir en base de datos o CRM (e.g., Supabase, Airtable, Sanity mutations).
  console.info("Nueva solicitud de contacto", payload);

  return NextResponse.json({ message: "Solicitud recibida" }, { status: 200 });
}