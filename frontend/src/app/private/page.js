"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect } from "react";

export default function PrivatePage() {
  const { user, isLoading } = useUser();

  // useEffect(() => {
  //   if (!user) {
  //     // redirect to Auth0 login
  //     window.location.href = "/";
  //   }
  // }, [user]);
  console.log("PrivatePage rendered", user, isLoading);

  if (isLoading) return <p className="text-center mt-20">Loading...</p>;
  if (!user) return <p className="text-center mt-20">Redirecting to login...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Private Dashboard</h1>
      <p className="mb-2">Full Name: {user.name}</p>
      <p className="mb-2">Email: {user.email}</p>
      <a
        href="/api/auth/logout"
        className="mt-4 bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600"
      >
        Sign Out
      </a>
    </div>
  );
}
