import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import SongItem from "./SongItem";

const playWithId = vi.fn();
const toggleFavorite = vi.fn();
const isFavorite = vi.fn().mockReturnValue(false);
const favoriteUpdatingIds = new Set<string>();

vi.mock("../../context/MusicContext", () => ({
  useMusic: () => ({
    playWithId,
    toggleFavorite,
    isFavorite,
    favoriteUpdatingIds,
  }),
}));

describe("SongItem", () => {
  const songProps = {
    _id: "song-1",
    image: "image.jpg",
    name: "Test Song",
    desc: "A description",
  };

  beforeEach(() => {
    playWithId.mockClear();
    toggleFavorite.mockClear();
    isFavorite.mockReturnValue(false);
    favoriteUpdatingIds.clear();
  });

  it("calls playWithId when card is clicked", () => {
    render(<SongItem {...songProps} />);
    fireEvent.click(screen.getByText("Test Song"));

    expect(playWithId).toHaveBeenCalledWith("song-1");
  });

  it("toggles favorite without triggering play click", () => {
    render(<SongItem {...songProps} />);
    fireEvent.click(screen.getByLabelText("Add to favorites"));

    expect(toggleFavorite).toHaveBeenCalledWith("song-1");
    expect(playWithId).not.toHaveBeenCalled();
  });
});
