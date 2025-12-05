# Auth Module Documentation

## Overview
The Auth module handles user authentication, including login, registration, and session management. It uses `next-auth` for backend authentication and `zustand` for client-side state management.

## Key Components

### Views
-   **Login.tsx**: The main login page (`/auth/login`). Renders the login form and handles user interaction.
-   **Register.tsx**: The registration page (`/auth/register`).

### Hooks
-   **useLogin.ts**: Encapsulates the logic for the login view. It handles form submission, calls the auth store, and redirects the user after successful login.
-   **useRegister.ts**: Encapsulates logic for registration.

### Store
-   **auth.ts**: A Zustand store that manages the user's session state (`user`, `loading`).
    -   `login(email, password)`: Calls `next-auth`'s `signIn`.
    -   `logout()`: Calls `next-auth`'s `signOut`.
    -   `bootstrap()`: Hydrates the store from the server-side session.

## Authentication Flow

The login process follows these steps:
1.  User enters credentials in `Login.tsx`.
2.  Form submission triggers `onSubmit` in `useLogin.ts`.
3.  `useLogin` calls `authStore.login`.
4.  `authStore.login` invokes `signIn("credentials")` from `next-auth/react`.
5.  If successful, the store updates the user state and `useLogin` redirects to the dashboard.

## Mermaid Flowchart

```mermaid
sequenceDiagram
    participant User
    participant LoginView as Login.tsx
    participant UseLogin as useLogin Hook
    participant AuthStore as Auth Store (Zustand)
    participant NextAuth as NextAuth (Client)
    participant API as NextAuth API

    User->>LoginView: Enter Credentials & Submit
    LoginView->>UseLogin: onSubmit(values)
    UseLogin->>AuthStore: login(email, password)
    AuthStore->>NextAuth: signIn('credentials', ...)
    NextAuth->>API: POST /api/auth/signin
    API-->>NextAuth: Session / Error
    NextAuth-->>AuthStore: Result
    
    alt Success
        AuthStore->>NextAuth: fetchSession (verify)
        NextAuth-->>AuthStore: Session Data
        AuthStore-->>AuthStore: Update User State
        AuthStore-->>UseLogin: { ok: true }
        UseLogin->>User: Message Success
        UseLogin->>User: Redirect to Dashboard
    else Failure
        AuthStore-->>UseLogin: { ok: false, message: ... }
        UseLogin->>User: Show Error Message
    end
```
