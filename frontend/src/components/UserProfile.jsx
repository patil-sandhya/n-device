"use client"

import { useState, useEffect } from "react"
// import ProfileForm from "./ProfileForm"
import { useRouter, useSearchParams } from "next/navigation"
import { v4 as uuidv4 } from "uuid";
import { useAlert } from "@/app/context/AlertContext";
import { ConfirmationBox } from "./Confirmation";

export default function UserProfile() {
  const [user, setUser] = useState({
    name: "",
    phone: "",
    email: ""
  })
  const [accessToken, setAccessToken] = useState(""); 
  const [activeSessions, setActiveSessions] = useState(0)
  const {setAlert} = useAlert()
  const [loading, setLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)
const searchParams = useSearchParams();
 const code = searchParams.get("code");
const [errors, setErrors] = useState({});
const router = useRouter()
 const [isOpen, setIsOpen] = useState(false)

  const handleConfirm = async() => {
    try {
      setLoading(true)
      const deviceId = localStorage.getItem("device_id");
      const token = localStorage.getItem("access_token");
      const res = await fetch("http://localhost:5000/session/force-logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },  
        body: JSON.stringify({
          deviceId: deviceId,
        }),
      });
      
      if (!res.ok) {
        throw new Error("Failed to terminate sessions");
      }

      const data = await res.json();
      console.log("Sessions terminated:", data);
      setAlert('success', "Other sessions terminated successfully!");
 setUser(data.user);
    setActiveSessions(data?.activeSessions?.length || 0);
    } catch (error) {
      
    }finally{
    setIsOpen(false)
      setLoading(false)
    }
  }

  const handleCancel = () => {
    console.log('User clicked No')
    setIsOpen(false)
  }

  const handleSave = async () => {
  setLoading(true); // start loading
    const userData = {
      fullName: user.name,
      phone: user.phone,
    }
  try {
    const res = await fetch("http://localhost:5000/user/update-profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`, 
      },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Failed to update profile");
    }

    const data = await res.json();
    console.log("Profile updated:", data);

    // Optionally update user state
    setUser(data.user);
    setAlert('success', "Profile updated successfully! ");
  } catch (err) {
    console.error("Error updating profile:", err);
    // setError(err.message);
  } finally {
    setLoading(false); // stop loading
  }
};


  const handleSignOut = async() => {
    try {
    const res = await fetch("http://localhost:5000/session/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`, 
      },
      body: JSON.stringify({
        deviceId: localStorage.getItem("device_id"),
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to sign out");
    }
    localStorage.removeItem("access_token");
    setAccessToken("");
    setUser({
      name: "",
      phone: "",
      email: ""
    });
    setAlert('success', "Signed out successfully!");
    router.push("/");
  } catch (err) {
    console.error("Error signing out:", err);
  }
  }



 const handleChange = (e) => {
    const { name, value } = e.target
     if (name === "phone") {
     let error = "";

    if (!/^\d+$/.test(value)) {
      error = "Phone number must contain only digits.";
    } else if (value.length !== 10) {
      error = "Phone number must be exactly 10 digits.";
    } else if (!/^[6-9]\d{9}$/.test(value)) {
      error = "Phone number must start with digits 6–9.";
    }

    setErrors((prev) => ({ ...prev, phone: error }));
  }
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const getDeviceId = () => {
  let deviceId = localStorage.getItem("device_id");
  
  if (!deviceId) {
    deviceId = uuidv4(); // or use uuidv4()
    localStorage.setItem("device_id", deviceId);
    console.log("New device ID generated:", deviceId);
  } else {
    console.log("Existing device ID found:", deviceId);
  }

  return deviceId;
  }

  const verifyCode = async () => {
  setLoading(true); // start loading
  try {
    const deviceId = getDeviceId();
    const res = await fetch(`http://localhost:5000/user/verify-code?code=${code}&deviceid=${deviceId}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const data = await res.json();
    console.log("verify code res", data);

     if (res.status === 409 && data.status === "max_sessions") {
    setIsOpen(true)
    localStorage.setItem("access_token", data.accessToken);
    setAccessToken(data.accessToken);
    return;
  }

    if (!res.ok) {
      throw new Error("Failed to verify code");
    }   

    // Save access token and user info
    localStorage.setItem("access_token", data.accessToken);
    setAccessToken(data.accessToken);
    setUser(data.user);
    setActiveSessions(data?.activeSessions?.length || 0);
  } catch (err) {
    console.error("Error verifying code:", err);
    // setError(err.message || "Something went wrong");
  } finally {
    setLoading(false); // stop loading
  }
};

const getUserProfile = async () => {
  setLoading(true); 
  try {
    const token = localStorage.getItem("access_token");
    const deviceId = getDeviceId();
    const res = await fetch(`http://localhost:5000/user/profile-details?deviceid=${deviceId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, 
      },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch user profile");
    }
    const data = await res.json();
    setUser(data.user);
    setActiveSessions(data?.activeSessions?.length || 0);
  } catch (err) {
    console.error("Error fetching user profile:", err);
  } finally {
    setLoading(false); 
  }

}


  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setAccessToken(token);
    getUserProfile()
    }else{
      verifyCode();
    }
    
  }, [code]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8">
       <ConfirmationBox
        isOpen={isOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
      {loading ? (
        <div className="flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
    </div>
      ) : (
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground text-center">Account Settings</h1>
          <p className="text-muted-foreground text-center mt-2">Manage your profile and device information</p>
        </div>

        {/* Main Card */}
        {
            (user.email !== null && user.email !== '') && (
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          {/* Profile Form */}
          
<div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Profile Information</h2>

      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={user?.name ?? ""}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter your full name"
        />
      </div>

      
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">
          Phone Number
        </label>
        <input
          id="phone"
          type="tel"
          name="phone"
          value={user?.phone ?? ""}
          onChange={handleChange}
           className={`w-full px-3 py-2 rounded-md border ${
    errors.phone ? "border-red-400" : "border-input"
  } bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 ${
    errors.phone ? "focus:ring-red-400" : "focus:ring-ring"
  }`}
          placeholder="Enter your phone number"
        />
        {errors.phone && (
  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
)}
      </div>
    </div>
          <div className="my-6 h-px bg-border" />  
          <div className="space-y-4">
      
        <div className="flex justify-between items-center py-2 px-3 rounded-md bg-muted/50">
          <div className="text-sm text-muted-foreground">
      <h2 className="">Logged In Device</h2>

          </div>
          <span className="text-sm font-medium text-foreground">{activeSessions}</span>
      </div>
    </div>
          <div className="my-6 h-px bg-border" />

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleSave}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                isSaved ? "bg-green-500 text-white" : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {isSaved ? "✓ Saved" : "Save Changes"}
            </button>
            <button
              onClick={handleSignOut}
              className="flex-1 px-4 py-2 rounded-md font-medium border border-border text-foreground hover:bg-muted transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      )
          }
      </div>
      )}
    </div>
  )
}
