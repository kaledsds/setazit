// app/sign-in/page.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn("credentials", { email, password, redirect: false });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] px-4">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-2xl border border-[rgba(212,175,55,0.3)] shadow-xl backdrop-blur">
        {/* Left image */}
        <div className="hidden w-1/2 md:block">
          <img
            src="https://images.unsplash.com/photo-1493238792000-8113da705763?w=1600&h=900&fit=crop"
            alt="Luxury Car"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right form */}
        <div className="bg-card-car w-full p-8 md:w-1/2">
          <h1 className="mb-6 text-center text-3xl font-bold text-[var(--accent-gold)]">
            Sign In
          </h1>

          <Button
            variant="outline"
            className="mb-4 flex w-full items-center gap-2 border-[rgba(212,175,55,0.3)]"
            onClick={() => signIn("google")}
          >
            <FcGoogle className="text-xl" /> Continue with Google
          </Button>

          <div className="relative mb-4 text-center">
            <span className="bg-card-car text-foreground relative z-10 px-2 text-sm">
              or continue with email
            </span>
            <div className="absolute top-3 right-0 left-0 -z-0 border-t border-[rgba(212,175,55,0.2)]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-foreground block text-sm font-medium">
                Email
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-card-car text-foreground border-[rgba(212,175,55,0.3)]"
              />
            </div>

            <div>
              <label className="text-foreground block text-sm font-medium">
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-card-car text-foreground border-[rgba(212,175,55,0.3)]"
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-gold-light)] font-semibold text-black transition hover:scale-105"
            >
              Sign In
            </Button>
          </form>

          <p className="text-muted mt-6 text-center text-sm">
            Don’t have an account?{" "}
            <Link
              href="/sign-up"
              className="text-[var(--accent-gold)] hover:underline"
            >
              Sign Up
            </Link>
          </p>

          <Link href="/">
            <Button variant="ghost" className="text-foreground mt-4 w-full">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
