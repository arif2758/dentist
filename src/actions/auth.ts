"use server";

import { signIn, signOut, auth } from "@/auth";
import { ActionResponse, AuthUser } from "@/types";
import { AuthError } from "next-auth";

export async function loginAction(
  prevState: any,
  formData: FormData
): Promise<ActionResponse<AuthUser>> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const callbackUrl = (formData.get("callbackUrl") as string) || "/admin";

  if (!email || !password) {
    return {
      success: false,
      message: "ইমেইল এবং পাসওয়ার্ড উভয়ই সঠিকভাবে প্রদান করুন",
    };
  }

  try {
    await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirectTo: callbackUrl,
    });

    return {
      success: true,
      message: "লগইন সফল হয়েছে",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            message: "ভুল ইমেইল বা পাসওয়ার্ড। অনুগ্রহ করে সঠিক তথ্য দিন।",
          };
        default:
          return {
            success: false,
            message: "লগইন ব্যর্থ হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।",
          };
      }
    }
    // In Next.js, signIn with redirectTo throws NEXT_REDIRECT which must be propagated
    throw error;
  }
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/login" });
}

export async function getSessionUserAction(): Promise<AuthUser | null> {
  const session = await auth();
  if (!session?.user) return null;
  return {
    id: session.user.id || "",
    name: session.user.name || "",
    email: session.user.email || "",
    role: (session.user.role as any) || "staff",
    phone: session.user.phone,
    status: "active",
  };
}
