"use server";

import auth from "@/lib/auth";
import { redirect } from "next/navigation";

export async function signInAction(email: string, password: string) {
  try {

    const response = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      asResponse: true,
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Failed to login"
      };
    }

    redirect("/web-app");
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

