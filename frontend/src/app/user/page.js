import UserProfile from '@/components/UserProfile'
import React from 'react'
import { Suspense } from 'react';

const page = () => {
  return (
    <div>
      <Suspense>
        <UserProfile />
        </Suspense>
    </div>
  )
}
export default page
