"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircle } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigator = useNavigate();
  const [showVerify, setShowVerify] = useState<boolean>(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    console.log({ email, password });
    try {
      const res = await axios.post(
        "http://localhost:1313/auth/register",
        { email: email, password: password },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(res.data);

      setShowVerify(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-screen w-full">
      <div className="flex w-full flex-col items-center justify-center bg-white p-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Create your account</h1>
            <p className="text-gray-500">
              Enter details to create a new account
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="name@example.com"
                className="w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                type="password"
                className="w-full"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Signing up...
                </>
              ) : (
                "Sign up"
              )}
            </Button>
            {showVerify && <p className="text-sm text-green-500 text-center">Check your email for verification</p>}
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Button
                variant="link"
                className="h-auto p-0"
                onClick={() => navigator("/login")}
              >
                Sign in
              </Button>
            </p>
          </div>
        </div>
      </div>
      <div className="hidden w-1/2 bg-white lg:block">
        <div className="relative h-full w-full flex justify-center items-center">
          <img
            src="/landing.jpg"
            alt="Login background"
            className="object-cover h:full w-full"
          />
        </div>
      </div>
    </div>
  );
}
