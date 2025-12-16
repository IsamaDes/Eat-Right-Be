EatRight Backend

EatRight is a secure, scalable backend service designed to manage user authentication, role-based permissions, and meal plan operations for the EatRight ecosystem (Nutritionist, Client, and Admin dashboards).

Built with Node.js, Express, and TypeScript, this API prioritizes security, modular architecture, and developer clarity.

Features Overview
Authentication & Security

User Registration & Login with secure password hashing using bcrypt.

JWT-based authentication with:

Access Tokens (short-lived) for protected routes.

Refresh Tokens (longer-lived) for session renewal.

Token Refresh Endpoint — securely issues a new access token using a valid refresh token.

Account Lockout Protection — if a user enters a wrong password 3 times, their account is locked for 30 minutes, after which it’s automatically unlocked.

Token Blacklisting — on logout, refresh tokens are invalidated (blacklisted) to prevent reuse.

Helmet Middleware — applies secure HTTP headers for CSP, XSS, and clickjacking protection.

User Roles & Access Control

Each user is assigned a role upon registration:

client

nutritionist

admin

Role-Based Access Control (RBAC)

Protected routes are validated using a custom role middleware that ensures users can only perform actions permitted by their role.

Input Validation & Sanitization

All request payloads are validated and sanitized manually — without any external validation libraries — to prevent:

SQL Injection

NoSQL Injection

XSS or script injection attacks

Invalid or malicious user input

 Tech Stack

Runtime: Node.js (v18+)

Framework: Express.js

Language: TypeScript

Database: MongoDB (Mongoose ORM)

Security: bcrypt, JWT, Helmet

Middleware: Custom role-based and validation layers

Testing: Jest / Supertest (optional)


