// src/pages/AddressDetails.jsx
import React, { useMemo, useState, useEffect } from "react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";
import { useSignupStore } from "@/store/useSignupStore";
import { useNavigate } from "react-router-dom";
import { CITY_MAP } from "@/data/CITY_MAP";
import useAuthStore from "@/store/useAuthStore";

const ALL_STATES = Object.keys(CITY_MAP);

export default function AddressDetails() {
  const navigate = useNavigate();

  const [city, setCity] = useState("")
  const [state, setStateVal] = useState("")
  const [pincode, setPincode] = useState("")
  const [addressLine1, setAddressLine1] = useState("")
  const [addressLine2, setAddressLine2] = useState("")

  const loading = useSignupStore(state => state.loading);
  const success = useSignupStore(state => state.success);
  const verString = useSignupStore(state => state.verString);
  const mobile = useSignupStore(state => state.mobile);
  const name = useSignupStore(state => state.name);

  const addAddress = useSignupStore(state => state.addAddress);
  const submitSignup = useSignupStore(state => state.submitSignup);

  const setUser = useAuthStore(state => state.setUser);
  const setAuthenticated = useAuthStore(state => state.setAuthenticated);
  const setVerString = useSignupStore(state => state.setVerString);

  const [selectedState, setSelectedState] = useState(state || "");
  const [isOtherCity, setIsOtherCity] = useState(false);

  const citiesForState = useMemo(() => {
    if (!selectedState) return [];
    return CITY_MAP[selectedState] || [];
  }, [selectedState]);

  useEffect(() => {
    setCity("");
    setIsOtherCity(false);
    setStateVal(selectedState || "");
  }, [selectedState]);

  const handleSignup = async (e) => {
    e.preventDefault();

    setVerString(null);

    if (!addressLine1 || addressLine1.trim().length === 0) {
      setVerString("Address Line 1 is required");
      return;
    }

    if (!city || city.trim().length === 0) {
      setVerString("city is required");
      return;
    }
    if (!state || state.trim().length === 0) {
      setVerString("state is required");
      return;
    }
    if (!pincode || pincode.trim().length === 0) {
      setVerString("pincode is required");
      return;
    }
    const addressObj = {
      line1: addressLine1,
      line2: addressLine2,
      name: name,
      phone: mobile,
      city: city,
      state: state,
      pincode: pincode,
      label: null,
    }
    addAddress(addressObj);
    await submitSignup((data) => {
      console.log("sign in data is: ", data);
      setUser(data)
      setAuthenticated(true)
      navigate("/"); // adjust target as needed
      setVerString("");
    });
  };

  return (
    <div className="space-y-4">
      {/* Address */}
      <div className="space-y-1">
        <Label className="text-sm font-medium">Address</Label>
        <Input
          type="text"
          placeholder="Enter address iine 1"
          value={addressLine1 || ""}
          onChange={(e) => setAddressLine1(e.target.value)}
          className="rounded-xl"
          required
        />
        <Input
          type="text"
          placeholder="Enter address iine 2"
          value={addressLine2 || ""}
          onChange={(e) => setAddressLine2(e.target.value)}
          className="rounded-xl"
          required
        />
      </div>

      {/* State */}
      <div className="space-y-1">
        <Label className="text-sm font-medium">State</Label>

        <Select value={selectedState} onValueChange={(val) => setSelectedState(val)}>
          <SelectTrigger className="w-full rounded-xl">
            <SelectValue placeholder="Select state" />
          </SelectTrigger>

          <SelectContent>
            {ALL_STATES.map((st) => (
              <SelectItem key={st} value={st}>
                {st}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* City */}
      <div className="space-y-1">
        <Label className="text-sm font-medium">City</Label>

        {citiesForState.length > 0 ? (
          <Select
            value={isOtherCity ? "other" : city || ""}
            onValueChange={(val) => {
              if (val === "other") {
                setIsOtherCity(true);
                setCity("");
              } else {
                setIsOtherCity(false);
                setCity(val);
              }
            }}
          >
            <SelectTrigger className="w-full rounded-xl">
              <SelectValue placeholder="Select city" />
            </SelectTrigger>

            <SelectContent>
              {citiesForState.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}

              <SelectItem value="other">Other (type below)</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          // if no city list, fallback to text input
          <Input
            type="text"
            placeholder="Enter city"
            value={city || ""}
            onChange={(e) => {
              setCity(e.target.value);
              setIsOtherCity(true);
            }}
            className="rounded-xl"
            required
          />
        )}

        {/* Free text city input when Other selected */}
        {isOtherCity && (
          <Input
            type="text"
            placeholder="Type your city"
            value={city || ""}
            onChange={(e) => setCity(e.target.value)}
            className="rounded-xl mt-2"
            required
          />
        )}
      </div>

      {/* Pincode */}
      <div className="space-y-1">
        <Label className="text-sm font-medium">Pincode</Label>
        <Input
          type="text"
          placeholder="Enter pincode"
          value={pincode || ""}
          onChange={(e) => setPincode(e.target.value)}
          className="rounded-xl"
          required
        />
      </div>

      <div className="mt-4">
        <div className={`text-sm mb-2 ${success ? "text-green-600" : "text-red-600"}`}>{verString}</div>

        <Button type="submit" className="w-full" onClick={(e) => {
          e.preventDefault()
          handleSignup(e)
        }}>
          {loading ? "Creating..." : "Sign Up"}
        </Button>
      </div>
    </div>
  );
}
