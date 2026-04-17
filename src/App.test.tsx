import { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("react-router-dom", () => ({
  Link: ({ children }: { children: ReactNode }) => <>{children}</>,
  Routes: ({ children }: { children: ReactNode }) => <>{children}</>,
  Route: () => null,
  useLocation: () => ({ pathname: "/" }),
}), { virtual: true });

test("renders app navigation links", () => {
  render(<App />);

  expect(screen.getByText(/all books/i)).toBeInTheDocument();
  expect(screen.getByText(/safe zone calculator/i)).toBeInTheDocument();
});
