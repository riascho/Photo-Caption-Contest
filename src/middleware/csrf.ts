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
  // The library default reads from req.headers["x-csrf-token"] (for AJAX/API use).
  // HTML forms submit the token as a body field, so we read from req.body._csrf instead.
  getCsrfTokenFromRequest: (req) => req.body?._csrf,
});
