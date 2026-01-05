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
  // signup store (your setters & values)

  const [city, setCity] = useState("")
  const [state, setStateVal] = useState("")
  const [pincode, setPincode] = useState("")
  const [addressLine1, setAddressLine1] = useState("")
  const [addressLine2, setAddressLine2] = useState("")

  const {
    addAddress,
    password,
    confirmPassword,
    loading,
    error,
    success,
    submitSignup,
    mobile,
    name
  } = useSignupStore();

  const { setUser, setAuthenticated } = useAuthStore()

  // local: currently selected state for populating cities
  const [selectedState, setSelectedState] = useState(state || "");
  // special flag when user chooses "Other" city
  const [isOtherCity, setIsOtherCity] = useState(false);

  // update city options when state changes
  const citiesForState = useMemo(() => {
    if (!selectedState) return [];
    return CITY_MAP[selectedState] || [];
  }, [selectedState]);

  // Clear city if state changes
  useEffect(() => {
    setCity("");
    setIsOtherCity(false);
    // sync store state
    setStateVal(selectedState || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedState]);

  const handleSignup = async (e) => {
    e.preventDefault();

    // clear previous error
    useSignupStore.setState({ error: null });

    if (!addressLine1 || addressLine1.trim().length === 0) {
      useSignupStore.setState({ error: "Address Line 1 is required" });
      return;
    }

    if (!city || city.trim().length === 0) {
      useSignupStore.setState({ error: "city is required" });
      return;
    }
    if (!state || state.trim().length === 0) {
      useSignupStore.setState({ error: "state is required" });
      return;
    }
    if (!pincode || pincode.trim().length === 0) {
      useSignupStore.setState({ error: "pincode is required" });
      return;
    }
    const addressObj = {
      line1: addressLine1,
      line2: addressLine2,
      city: city,
      state: state,
      pincode: pincode,
    }
    addAddress(addressObj);
    // call submitSignup; on success navigate to login or home
    await submitSignup((data) => {
      console.log("sign in data is: ", data);
      setUser(data)
      setAuthenticated(true)
      navigate("/"); // adjust target as needed
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
        {error && <div className="text-sm text-red-600 mb-2">{error?.message}</div>}
        {success && <div className="text-sm text-green-600 mb-2">{success}</div>}

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
