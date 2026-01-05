import React from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Link, useNavigate } from "react-router-dom";
import { useSignupStore } from '@/store/useSignupStore';
import useAuthStore from '@/store/useAuthStore';

export default function Login() {
  const navigate = useNavigate();
  // signup store (your setters & values)
  const {
    identifier,
    setIdentifier,
    password,
    setPassword,
    submitLogin,
    error,
  } = useSignupStore();

  const { setUser, setAuthenticated } = useAuthStore()

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(identifier, password);
    if (!identifier) {
      useSignupStore.setState({ error: "Email or mobile is required" });
      return;
    }

    if (!password || password.length < 6) {
      useSignupStore.setState({ error: "Password must be at least 6 characters" });
      return;
    }

    // call submitSignup; on success navigate to login or home
    await submitLogin((data) => {
      setUser(data)
      setAuthenticated(true)
      navigate("/");
    });
  };

  return (
    <div className=''>
      <nav className="text-center text-xl font-semibold py-4">
        Login for batter experience
      </nav>

      <div className="space-y-4">
        {/* identifier */}
        <div>
          <label className="text-sm font-medium">
            Email or Mobile Number
          </label>
          <Input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="example@gmail.com"
          />
        </div>

        {/* password */}
        <div>
          <label className="text-sm font-medium">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your Password"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <Button className="w-full mt-2" onClick={handleLogin}>
          Login
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Create new account?{" "}
          <Link to="/verify/signup" className="text-primary font-medium">
            Signup
          </Link>
        </p>

      </div>
    </div>
  )
}
