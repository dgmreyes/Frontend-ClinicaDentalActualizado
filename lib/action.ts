"use server";

import { z } from "zod";
import { createSession } from "./seccion"; 
import { redirect } from "next/navigation";


const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";

const loginSchema = z.object({
  username: z.string().trim(),
  password: z.string().min(1, { message: "La contraseña es requerida" }).trim(),
});

export async function login(prevState: any, formData: FormData) {

  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { username, password } = result.data;

  try {
    const response = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier: username, 
        password: password,
      }),
      cache: "no-store", 
    });

    const data = await response.json();
    if (!response.ok) {

      const errorMessage = data?.error?.message || "Credenciales inválidas";
      
      return {
        errors: {
          username: ["posible error"], 
          password: ["posible error"],
          _form: [errorMessage], 
        },
      };
    }


    await createSession(data.user.id, data.jwt); 

  } catch (err) {
    console.error("Error en login:", err);
    return {
      errors: {
        _form: ["Ocurrió un error de conexión con el servidor"],
      },
    };
  }


  redirect("/dashboard");
}