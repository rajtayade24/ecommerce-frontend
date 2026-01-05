import React from 'react'
import { Link, Outlet } from 'react-router-dom'

export default function Signup() {
  return (
    <div className=''>
      <Outlet />

      <p className="pt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/verify/login" className="text-primary font-medium">
          Login
        </Link>
      </p>
    </div>
  )
}
