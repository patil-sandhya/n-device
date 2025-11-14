"use client"

export default function ProfileForm({ user, setUser }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
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
          value={user?.name}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter your full name"
        />
      </div>

      {/* Phone Field */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">
          Phone Number
        </label>
        <input
          id="phone"
          type="tel"
          name="phone"
          value={user?.phone}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter your phone number"
        />
      </div>
    </div>
  )
}
