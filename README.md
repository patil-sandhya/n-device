# N-Device Auth System using Next.js, Auth0, and Node.js

This project implements a mini full-stack web application with secure authentication using Auth0, a polished Next.js frontend, and a Node.js/Express backend that enforces N-Device Login Restriction.

Only N devices are allowed to stay logged in at a time for each user
When a user logs in from a new device (N+1), they are prompted to:
Cancel Login, OR
Force Logout one of the previously active devices.
If a previously logged-out device comes back online, it receives a graceful force-logout message.

<img width="1887" height="867" alt="image" src="https://github.com/user-attachments/assets/1df54b2a-8ae1-4f82-9628-0e9d2a7d687c" />

---

## 🚀 Features

### ** Authentication**
Secure login using Auth0 (OAuth 2.0).
Frontend uses Auth0 Universal Login.
Backend verifies Auth0-issued access_token (RS256).

<img width="547" height="877" alt="Screenshot 2025-11-15 085843" src="https://github.com/user-attachments/assets/c5fd5174-ca9f-4097-9026-7259ba0de404" />

### N-Device Session Control
Each user may stay logged in on max N devices.
Session is tracked per (userId + deviceId) pair.
Attempting login on too many devices returns:
User can force-logout any existing device from frontend.

<img width="754" height="458" alt="Screenshot 2025-11-15 090352" src="https://github.com/user-attachments/assets/5a56cd65-6f7f-4e7a-8207-d7dd2c630b1f" />

### Graceful Forced Logout
Logged-out devices (due to force logout) are automatically:
  - Redirected to logout
  - Shown a message like:

  <img width="697" height="504" alt="Screenshot 2025-11-15 090704" src="https://github.com/user-attachments/assets/784688c1-c385-40ef-a653-93f22f01a760" />



### Profile Page (Private)
Fetches user details from backend.
Shows full name, phone number, active device count along with update & sign out button

<img width="701" height="840" alt="Screenshot 2025-11-15 090501" src="https://github.com/user-attachments/assets/1a144db8-d419-49e9-972e-7621a3371967" />
