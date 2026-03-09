import { doubleCsrf } from "csrf-csrf";

export const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () =>
    process.env.CSRF_SECRET || "csrf-secret-change-in-production",
  getSessionIdentifier: (req) => req.sessionID,
  cookieName: "csrf-token",
  cookieOptions: {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  },
});
