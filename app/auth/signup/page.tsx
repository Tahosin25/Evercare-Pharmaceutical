import type { Metadata } from "next";
import { Suspense } from "react";
import { SignupForm } from "@/components/auth/auth-forms";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your Evercare account to shop trusted medicines.",
};

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <SignupForm />
    </Suspense>
  );
}
