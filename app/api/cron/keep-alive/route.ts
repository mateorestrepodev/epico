import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabase";

// Forzamos que esta ruta sea dinámica para evitar que Next.js la cachee estáticamente
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    // Validamos el Authorization Header para asegurarnos de que solo Vercel (o nosotros) pueda ejecutar esto
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse("No autorizado", { status: 401 });
    }

    // Ejecutamos una consulta ultraligera para "despertar/mantener" Supabase
    const { data, error } = await supabase
      .from("proyectos")
      .select("id")
      .limit(1);

    if (error) {
      console.error("Error en Keep-Alive Supabase:", error);
      throw error;
    }

    return NextResponse.json(
      { 
        status: "Supabase Activo", 
        timestamp: new Date().toISOString() 
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error al mantener la conexión con la base de datos." },
      { status: 500 }
    );
  }
}