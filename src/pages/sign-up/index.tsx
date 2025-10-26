"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setSuccess("Account created successfully!");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setName("");
    } catch (err) {
      console.error("Signup error:", err);
      setError("Network error, please try again later.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-(--bg-primary) px-4">
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
          <h1 className="mb-6 text-center text-3xl font-bold text-(--accent-gold)">
            Sign Up
          </h1>

          <Button
            variant="outline"
            className="text-foreground mb-4 flex w-full items-center gap-2 border-[rgba(212,175,55,0.3)]"
            onClick={() => signIn("google")}
          >
            <FcGoogle className="text-xl" /> Continue with Google
          </Button>

          <div className="relative mb-4 text-center">
            <span className="bg-card-car text-foreground relative z-10 px-2 text-sm">
              or create account with email
            </span>
            <div className="absolute top-3 right-0 left-0 z-0 border-t border-[rgba(212,175,55,0.2)]" />
          </div>

          {error && (
            <div className="mb-4 rounded-md border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-foreground block text-sm font-medium">
                Full Name
              </label>
              <Input
                type="text"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-card-car text-foreground border-[rgba(212,175,55,0.3)]"
              />
            </div>

            <div>
              <label className="text-foreground block text-sm font-medium">
                Date of Birth
              </label>
              <Input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="bg-card-car text-foreground border-[rgba(212,175,55,0.3)]"
              />
            </div>

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

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="text-foreground block text-sm font-medium">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-card-car text-foreground border-[rgba(212,175,55,0.3)]"
                />
              </div>

              <div className="w-1/2">
                <label className="text-foreground block text-sm font-medium">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-card-car text-foreground border-[rgba(212,175,55,0.3)]"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full rounded-full bg-linear-to-r from-(--accent-gold) to-(--accent-gold-light) font-semibold text-black transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {/* {signUpMutation.isPending
                ? "Creating Account..."
                : "Create Account"} */}
              Create Account
            </Button>
          </form>

          <p className="text-muted mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-(--accent-gold) hover:underline"
            >
              Sign In
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
