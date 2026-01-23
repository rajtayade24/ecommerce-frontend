import React from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Link, useNavigate } from "react-router-dom";
import { useSignupStore } from '@/store/useSignupStore';
import useAuthStore from '@/store/useAuthStore';

export default function Login() {
  const navigate = useNavigate();

  const identifier = useSignupStore(state => state.identifier);
  const password = useSignupStore(state => state.password);
  const success = useSignupStore(state => state.success);
  const verString = useSignupStore(state => state.verString);

  const setIdentifier = useSignupStore(state => state.setIdentifier);
  const setPassword = useSignupStore(state => state.setPassword);
  const submitLogin = useSignupStore(state => state.submitLogin);
  const setUser = useAuthStore(state => state.setUser);
  const setAuthenticated = useAuthStore(state => state.setAuthenticated);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("login request", identifier, password);
    if (!identifier) {
      setVerString("Email or mobile is required");
      return;
    }

    if (!password || password.length < 6) {
      setVerString("Password must be at least 6 characters");
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

        <div className={`text-sm mb-2 ${success ? "text-green-600" : "text-red-600"}`}>{verString}</div>

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
