import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";


const secretKey = process.env.SESSION_SECRET || "clave-secreta-muy-segura-por-favor-cambiala";
const encodedKey = new TextEncoder().encode(secretKey);


type SessionPayload = {
  userId: string | number;
  strapiJWT: string;
  role?: string;
  expiresAt: Date;
};


export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // La sesión dura 7 días
    .sign(encodedKey);
}


export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null; // Si el token es inválido o expiró
  }
}

export async function createSession(userId: string | number, strapiJWT: string, role?: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const session = await encrypt({ userId, strapiJWT, role, expiresAt });
  
  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true, 
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}
export async function getSession() {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    return null;
  }

  return session;
}


export async function deleteSession() {
  (await cookies()).delete("session");
}
