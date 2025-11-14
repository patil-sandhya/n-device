"use client";

export default function AuthPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-8">Sign In / Sign Up</h1>

      <a
        href="/api/auth/login"
        className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 mb-4"
      >
        Sign In / Sign Up with Auth0
      </a>

      <p className="text-gray-600">After login, you will be redirected to your private dashboard.</p>
    </div>
  );
}
