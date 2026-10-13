import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { invoke } from "@tauri-apps/api/core";
import App from "./App";

vi.mock("@uiw/react-color", () => ({
  Sketch: ({
    color,
    onChange,
  }: {
    color: string;
    onChange: (color: {
      hex: string;
      rgb: { r: number; g: number; b: number };
    }) => void;
  }) => (
    <button
      type="button"
      data-testid="color-picker"
      data-color={color}
      onClick={() =>
        onChange({
          hex: "#123456",
          rgb: { r: 18, g: 52, b: 86 },
        })
      }
    >
      Choose color
    </button>
  ),
}));

vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(),
}));

describe("App", () => {
  beforeEach(() => {
    vi.mocked(invoke).mockReset();
  });

  it("updates the selected hex and renders the generated gradient swatches", async () => {
    vi.mocked(invoke).mockResolvedValueOnce([
      { r: 18, g: 52, b: 86 },
      { r: 32, g: 64, b: 96 },
    ]);

    render(<App />);
    const colorPicker = screen.getByTestId("color-picker");

    expect(colorPicker).toHaveAttribute("data-color", "#fff");

    fireEvent.click(colorPicker);

    expect(colorPicker).toHaveAttribute("data-color", "#123456");
    expect(invoke).toHaveBeenCalledWith("generate_gradient", {
      color: { r: 18, g: 52, b: 86 },
    });

    await waitFor(() => {
      expect(screen.getByText("rgb(18, 52, 86)")).toHaveStyle({
        backgroundColor: "rgb(18, 52, 86)",
      });
      expect(screen.getByText("rgb(32, 64, 96)")).toHaveStyle({
        backgroundColor: "rgb(32, 64, 96)",
      });
    });
  });
});
