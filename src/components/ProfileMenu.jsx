import React, { useRef, useEffect } from 'react'
import {
  User,
  Package,
  ShoppingCart,
  Sun,
  Moon,
  Coins,
  Bell,
  Info,
  LogOut,
} from "lucide-react"
import { Button } from './ui/Button'
import useAuthStore from '@/store/useAuthStore'
import { useSignupStore } from '@/store/useSignupStore'
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogTrigger } from './ui/Dialog'
import DialogContentImpl from './DialogContentImpl'
import { DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem } from './ui/DropdownMenu'

function ProfileMenu() {
  const navigate = useNavigate();
  const setUser = useAuthStore(s => s.setUser)
  const setAuthenticated = useAuthStore(s => s.setAuthenticated)
  const setUserMainId = useAuthStore(s => s.setUserMainId)
  const setToken = useAuthStore(s => s.setToken)
  const onLogout = useSignupStore(s => s.onLogout)
  const darkMode = useAuthStore(s => s.darkMode)
  const toggleDarkMode = useAuthStore(s => s.toggleDarkMode)

  const handleLogout = () => {
    onLogout();
    setUser(null)
    setToken(null)
    setUserMainId(null)
    setAuthenticated(false)
    navigate("/");
  }

  return (
    <DropdownMenuContent className="w-40 p-0 rounded-none" align="end">
      <DropdownMenuGroup>

        <DropdownMenuItem className='p-0 m-0 w-full'>
          <Link to="/me/profile" className='w-full'>
            <Button variant="ghost" className="w-full justify-start rounded-none">  <User size={16} />Your Account</Button>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className='p-0 m-0 w-full'>
          <Link to="/orders" className='w-full'>
            <Button variant="ghost" className="w-full justify-start rounded-none">  <Package size={16} /> Your Orders</Button>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className='p-0 m-0 w-full'>
          <Link to="/carts" className='w-full'>
            <Button variant="ghost" className="w-full justify-start rounded-none"> <ShoppingCart size={16} />Your Cart</Button>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className='p-0 m-0 w-full'>
          <Button onClick={toggleDarkMode} variant="ghost" className="w-full justify-start rounded-none">
            {darkMode ? <> <Sun size={16} /> Light mode </> : <><Moon size={16} /> Dark Mode </>}
          </Button>
        </DropdownMenuItem>

        <DropdownMenuItem className='p-0 m-0 w-full'>
          <Button variant="ghost" className="w-full justify-start rounded-none">  <Bell size={16} />Notification</Button>
        </DropdownMenuItem>

        <DropdownMenuItem className='p-0 m-0 w-full'>
          <Link to="/about" className='w-full'>
            <Button variant="ghost" className="w-full justify-start rounded-none">   <Info size={16} />About</Button>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className='p-0 m-0 w-full'
          onSelect={(e) => e.preventDefault()} // 👈 IMPORTANT
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="w-full justify-start rounded-none">  <LogOut size={16} />Logout</Button>
            </DialogTrigger>

            <DialogContentImpl
              desc='Do you Want to logout??'
              title='Logout Conformation'
              save='Logout'
              onSave={handleLogout}
            />
          </Dialog>
        </DropdownMenuItem>

      </DropdownMenuGroup>
    </DropdownMenuContent>
  )
}

export default ProfileMenu;

