import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders world safe zone heading", () => {
  render(<App />);
  expect(
    screen.getByRole("heading", {
      name: /find the safest place to live based on your lifestyle/i
    })
  ).toBeInTheDocument();
});
