import { render, screen } from "@testing-library/react";
import App from "./App";

// Firebase কল আসল নেটওয়ার্কে না গিয়ে টেস্ট যেন পাশ করে, তাই auth mock করা হলো
jest.mock("./firebase/config", () => ({
  auth: {},
  db: {},
  googleProvider: {},
}));

jest.mock("./firebase/authService", () => ({
  subscribeToAuthChanges: (cb) => {
    cb(null); // not logged in
    return () => {};
  },
  loginWithGoogle: jest.fn(),
  logout: jest.fn(),
  deleteCurrentAccount: jest.fn(),
  getCurrentUser: () => null,
}));

test("renders login screen when logged out", async () => {
  render(<App />);
  const heading = await screen.findByText(/হিসাব প্রো/i);
  expect(heading).toBeInTheDocument();
});
