import React from "react"
import { render } from "@testing-library/react"
import App from "../App"

test("should render App with correct text", () => {
  const { getByRole } = render(<App />)
  const header = getByRole("heading")

  expect(header.textContent).toBe("App has arrived")
})
