"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const password = formData.get("password");
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set("dvya_admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
    });
    redirect("/admin");
  } else {
    return { error: "Invalid password" };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("dvya_admin_session");
  redirect("/admin/login");
}
