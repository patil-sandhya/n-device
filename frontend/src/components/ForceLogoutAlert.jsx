'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function ForceLogoutAlert({
    isOpen
}) {
  const router = useRouter();

  const handleOk = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("device_id");
    router.push('/');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-lg shadow-lg max-w-sm w-full p-6 space-y-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex flex items-center justify-center h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30">
            <svg
              className="h-6 w-6 text-red-600 dark:text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4v2m0 4v2M12 3a9 9 0 100 18 9 9 0 000-18z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground">
              Session Ended
            </h2>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          You have been logged out for security reasons. Your session has ended.
          Please log in again to continue.
        </p>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleOk}
            className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
