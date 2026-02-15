"use client";

import Image from "next/image";
import Link from "next/link";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Mail, Lock, ArrowRight, ArrowLeft } from "lucide-react";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEmailSignIn } from "@/hooks/auth";
import { useEffect } from "react";

/* -------------------------------- Schema -------------------------------- */

const formSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password is required"),
});

type FormValues = z.infer<typeof formSchema>;

/* -------------------------------- Page -------------------------------- */

export default function AdminLoginPage() {
  const router = useRouter();
  const { signIn, loading, error } = useEmailSignIn();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!error && !loading) {
      toast.success("Logged in successfully");
      router.push("/web-app");
    }
    if (error && !loading) {
      toast.error(error);
    }
  });


  const onSubmit = async function (values: FormValues) {
    await signIn({
      email: values.email,
      password: values.password,
      callbackURL: "/web-app",
      rememberMe: true,
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-muted/20 px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* ------------------------------ Logo ------------------------------ */}
        <div className="mx-auto w-20">
          <AspectRatio ratio={1 / 1}>
            <Image
              src="/logo.jpg"
              alt="Chintan Chikitsa"
              fill
              className="rounded-full object-contain"
              priority
            />
          </AspectRatio>
        </div>

        {/* ------------------------------ Headings ------------------------------ */}
        <div className="space-y-1">
          <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
            Chintan Chikitsa
          </h1>

          <p className="text-muted-foreground text-sm tracking-widest">
            ADMIN LOGIN
          </p>
        </div>

        {/* ------------------------------ Card ------------------------------ */}
        <Card className="shadow-lg border-muted/40">
          <CardHeader />

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* ---------------- Email ---------------- */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>

                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            placeholder="admin@chintanchikitsa.com"
                            className="pl-10"
                          />
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ---------------- Password ---------------- */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>

                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            type="password"
                            placeholder="••••••••"
                            className="pl-10"
                          />
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ---------------- Submit ---------------- */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-xl bg-green-500 hover:bg-green-600 shadow-md"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login to Portal"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-green-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </CardFooter>
        </Card>

        {/* ------------------------------ Back Link ------------------------------ */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to main website
        </Link>
      </div>
    </main>
  );
}
