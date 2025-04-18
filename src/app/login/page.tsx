"use client";
import { login, signup } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [isSignupComplete, setIsSignupComplete] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");

  const handleSignup = async (formData: any) => {
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const email = formData.get("email");

    if (password !== confirmPassword) {
      // You can add better error handling here
      alert("Passwords do not match");
      return;
    }

    // Store email for confirmation screen
    setSignupEmail(email);

    try {
      // Call the signup action
      await signup(formData);
      // Show the confirmation screen if successful
      setIsSignupComplete(true);
    } catch (error) {
      // Handle errors
      console.error("Signup failed:", error);
      alert("Signup failed. Please try again.");
    }
  };

  // Email verification success screen
  if (isSignupComplete) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-md border border-gray-100">
            <CardHeader className="text-center">
              <div className="mx-auto my-4 bg-green-100 rounded-full p-3 w-14 h-14 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <CardTitle className="text-xl text-gray-800">
                Check your email
              </CardTitle>
              <CardDescription className="mt-2 text-gray-600">
                We've sent a verification link to{" "}
                <span className="font-medium text-gray-800">{signupEmail}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <p className="text-sm text-gray-500 mb-6">
                Please check your inbox and click on the verification link to
                complete your registration.
              </p>
              <Button
                onClick={() => {
                  setIsSignupComplete(false);
                  setActiveTab("login");
                }}
                variant="outline"
                className="mt-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
              >
                Back to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Brand */}
        <div className="flex flex-col items-center space-y-3">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">FormSense</h1>
          <p className="text-center text-gray-500">
            Transform Form Images into Structured Data
          </p>
        </div>

        <Card className="shadow-md border border-gray-100 overflow-hidden">
          <Tabs
            defaultValue="login"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-none border-b border-gray-200">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 pt-6">
              <CardHeader className="p-6 pb-0">
                <CardTitle className="text-xl text-gray-800">
                  Welcome back
                </CardTitle>
                <CardDescription className="text-gray-500">
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-gray-700">
                      Email
                    </Label>
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      className="border-gray-300 focus:border-blue-300 focus:ring-blue-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password" className="text-gray-700">
                        Password
                      </Label>
                      <Link
                        href="/forgot-password"
                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="login-password"
                      name="password"
                      type="password"
                      required
                      className="border-gray-300 focus:border-blue-300 focus:ring-blue-200"
                    />
                  </div>
                  <Button
                    formAction={login}
                    className="w-full bg-blue-600 hover:bg-blue-700 mt-2"
                    type="submit"
                  >
                    Sign in
                  </Button>
                </form>
              </CardContent>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 pt-6">
              <CardHeader className="p-6 pb-0">
                <CardTitle className="text-xl text-gray-800">
                  Create an account
                </CardTitle>
                <CardDescription className="text-gray-500">
                  Enter your details to create your account
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-gray-700">
                      Email
                    </Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      className="border-gray-300 focus:border-blue-300 focus:ring-blue-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-gray-700">
                      Password
                    </Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="Create a strong password"
                      required
                      className="border-gray-300 focus:border-blue-300 focus:ring-blue-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-gray-700">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirm-password"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      required
                      className="border-gray-300 focus:border-blue-300 focus:ring-blue-200"
                    />
                  </div>
                  <Button
                    formAction={(formData) => handleSignup(formData)}
                    className="w-full bg-blue-600 hover:bg-blue-700 mt-2"
                    type="submit"
                  >
                    Create account
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <p className="text-xs text-center text-gray-500 w-full">
                  By signing up, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </CardFooter>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Alternative login methods */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-50 px-3 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="w-full border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Google
            </Button>
            <Button
              variant="outline"
              className="w-full border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
              </svg>
              Facebook
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
