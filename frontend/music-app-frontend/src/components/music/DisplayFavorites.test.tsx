import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import DisplayFavorites from "./DisplayFavorites";

const musicState = {
  favoriteSongs: [] as any[],
  isFavoritesLoading: false,
  searchQuery: "",
};

vi.mock("../../context/MusicContext", () => ({
  useMusic: () => musicState,
}));

vi.mock("./Navbar", () => ({
  __esModule: true,
  default: () => <div data-testid="navbar">Navbar</div>,
}));

vi.mock("./SongItem", () => ({
  __esModule: true,
  default: (props: any) => <div data-testid="song-item">{props.name}</div>,
}));

describe("DisplayFavorites", () => {
  it("shows empty state when no favorites", () => {
    musicState.favoriteSongs = [];
    render(<DisplayFavorites />);
    expect(screen.getByText("Your Favorites")).toBeInTheDocument();
    expect(
      screen.getByText("You have not favorited any songs yet.")
    ).toBeInTheDocument();
  });

  it("renders favorite songs when present", () => {
    musicState.favoriteSongs = [
      { _id: "1", name: "Song A", desc: "desc", image: "", album: "", file: "", duration: "" },
    ];
    render(<DisplayFavorites />);

    expect(screen.getByTestId("song-item")).toHaveTextContent("Song A");
  });
});
