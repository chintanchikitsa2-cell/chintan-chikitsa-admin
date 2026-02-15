"use client";

import { useState, useCallback } from "react";
import { authClient } from "@/lib/auth-client";

type SignInInput = {
  email: string;
  password: string;
  callbackURL?: string;
  rememberMe?: boolean;
};

type UseEmailSignInResult = {
  signIn: (input: SignInInput) => Promise<void>;
  loading: boolean;
  error: string | null;
  data: unknown;
};

export function useEmailSignIn(): UseEmailSignInResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<unknown>(null);

  const signIn = useCallback(async (input: SignInInput) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await authClient.signIn.email(
        {
          email: input.email,
          password: input.password,
          callbackURL: input.callbackURL ?? "/dashboard",
          rememberMe: input.rememberMe ?? true,
        },
        {
          // callbacks here if needed
        }
      );

      if (error) {
        throw error;
      }

      setData(data);
    } catch (err: any) {
      setError(err?.message ?? "Sign in failed");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [data,]);

  return {
    signIn,
    loading,
    error,
    data,
  };
}
