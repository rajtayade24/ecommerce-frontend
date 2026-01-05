import React from 'react'
import { Outlet } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/Card'

export default function UserVerification() {
  return (
    <div className='min-h-[calc(100vh-64px)] flex justify-center items-center'>
      <Card className="w-full max-w-md mx-auto p-4 rounded-2xl shadow-md">
        <CardContent className="space-y-4">
          <form >
            <Outlet />
          </form>
        </CardContent>
      </Card>

    </div>
  )
}
