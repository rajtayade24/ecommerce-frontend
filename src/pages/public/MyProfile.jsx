import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/Dialog"
import useAuthStore from "@/store/useAuthStore";
import { formatDate } from "@/utils/formatDate";
import { getUserAddress } from "@/service/authService";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { EditProfile } from "@/components/EditProfile";
import UnAuthorizedUser from "@/pages/public/UnAuthorizedUser";
import DialogContentImpl from "@/components/DialogContentImpl";
import { useSignupStore } from "@/store/useSignupStore";
import { Card } from "@/components/ui/Card";
// MyProfile.jsx
export default function MyProfile() {
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  const { isAuthenticated } = useAuthStore();
  const setUserMainId = useAuthStore(s => s.setUserMainId)
  const setToken = useAuthStore(s => s.setToken)
  const onLogout = useSignupStore(s => s.onLogout)

  const [addresses, setAddresses] = useState([])
  const primaryAddress = addresses?.find(a => a.primaryAddress === true);

  useEffect(() => {
    const fetchAddress = async () => {
      setAddresses(await getUserAddress())
    }
    fetchAddress();
  }, []);

  const handleLogout = () => {
    onLogout();
    setUser(null)
    setToken(null)
    setUserMainId(null)
    setAuthenticated(false)
    navigate("/");
  }

  const initials = (user?.name || "?")
    .split(" ")
    .map((s) => s.charAt(0))
    .slice(0, 2)
    .join("");

  if (!isAuthenticated) {
    return <UnAuthorizedUser />;
  }

  if (!user)
    return (
      <div className="p-4 max-w-xl mx-auto text-center">
        <p>No user data. Please login.</p>
        <Button
          onClick={() => navigate("/verify/login")}
          className="mt-3 px-4 py-2"
        >
          Login
        </Button>
      </div>
    );

  return (
    <      Card
  className = "max-w-3xl mx-auto " >
    <div className="shadow-md rounded-lg p-4 flex gap-6 border-muted">
      <div className="flex-shrink-0">
        <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-700">
          {initials}
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">{user.name || "No name"}</h2>
            <p className="text-sm text-gray-500">Member since {formatDate(user.createdAt)}</p>
          </div>

          <div className="flex items-center gap-2">
            <Dialog>
              <form>
                <DialogTrigger asChild>
                  <Button variant="outline">Edit</Button>
                </DialogTrigger>
                <EditProfile user={user} />
              </form>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full justify-start rounded-none">  Logout</Button>
              </DialogTrigger>

              <DialogContentImpl
                desc='Do you Want to logout??'
                title='Logout Conformation'
                save='Logout'
                onSave={handleLogout}
              />
            </Dialog>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm text-gray-600">Contact</h3>
            <p className="font-medium">{user.email || "-"}</p>
            <p className="text-sm text-gray-500">{user.mobile || "-"}</p>
          </div>

          <div className="sm:col-span-2">
            <h3 className="text-sm text-gray-600">Addresses</h3>
            <div className="mt-2 space-y-2">
              <div className="mt-4 space-y-3">
                {addresses.length ? (
                  addresses.map((a) => (
                    <Label
                      key={a.id}
                      className={`flex items-center border rounded-lg p-4 transition-shadow hover:shadow-md
                          }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="font-semibold">{a.name}</div>
                          <div className="ml-auto text-sm text-slate-500">{a.phone}</div>
                        </div>

                        <div className="text-sm text-slate-600 mt-2">{a.line1} {a.line2}</div>
                        <div className="text-sm text-slate-600">{a.city}, {a.state} — <span className="font-medium">{a.pincode}</span></div>
                      </div>
                    </Label>
                  ))
                ) : (
                  <div className="p-4 text-center text-slate-500">No saved addresses. Add a new address to continue.</div>
                )}

                <div className="pt-2 border-t">
                  <Button className="text-sm ">+ Add a new address</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Card>
  );
}
