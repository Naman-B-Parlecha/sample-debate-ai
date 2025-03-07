"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircle } from "lucide-react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthToken } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch = useDispatch();

  const navigator = useNavigate();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    console.log({ email, password });
    try {
      const res = await axios.post(
        "http://localhost:1313/auth/login",
        { email: email, password: password },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(res.data);
      dispatch(setAuthToken(res.data.accessToken));
      navigator("/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex h-screen w-full">
      <div className="hidden w-1/2 bg-white lg:block">
        <div className="relative h-full w-full flex justify-center items-center">
          <img
            src="/landing.jpg"
            alt="Login background"
            className="object-cover h:full w-full"
          />
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center bg-white p-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-gray-500">
              Enter your credentials to sign in to your account
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
                <Button
                  variant="link"
                  className="h-auto p-0 text-sm"
                  type="button"
                >
                  Forgot password?
                </Button>
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
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Button variant="link" className="h-auto p-0" onClick={() => navigator("/register")}>
                Sign up
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
