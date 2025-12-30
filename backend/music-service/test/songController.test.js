import { describe, it, expect, vi, beforeEach } from "vitest";

import { addSong, listSong, removeSong } from "../src/controllers/songController.js";
import { createMockResponse } from "./helpers/mockResponse.js";

const mockSave = vi.fn();
const mockFind = vi.fn();
const mockFindByIdAndDelete = vi.fn();

vi.mock("cloudinary", () => ({
  v2: {
    uploader: {
      upload: vi.fn(async (path, opts) => {
        if (opts?.resource_type === "video") {
          return { secure_url: "https://cdn.test/audio.mp3", duration: 125 };
        }
        return { secure_url: "https://cdn.test/image.jpg" };
      }),
    },
  },
}));

vi.mock("../src/models/Song.js", () => {
  const Song = (data) => ({ ...data, save: mockSave });
  Song.find = mockFind;
  Song.findByIdAndDelete = mockFindByIdAndDelete;
  return { default: Song };
});

describe("songController", () => {
  beforeEach(() => {
    mockSave.mockReset();
    mockFind.mockReset();
    mockFindByIdAndDelete.mockReset();
  });

  it("adds a song and uploads files", async () => {
    const req = {
      body: { name: "Track", desc: "Desc", album: "Album" },
      files: {
        audio: [{ path: "/tmp/audio" }],
        image: [{ path: "/tmp/image" }],
      },
    };
    const res = createMockResponse();

    await addSong(req, res);

    expect(mockSave).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, message: "Song Added" })
    );
  });

  it("lists songs", async () => {
    const res = createMockResponse();
    mockFind.mockResolvedValueOnce([{ name: "Song 1" }]);

    await listSong({}, res);

    expect(mockFind).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, songs: [{ name: "Song 1" }] })
    );
  });

  it("removes a song", async () => {
    const res = createMockResponse();
    const req = { params: { id: "song-id" } };

    await removeSong(req, res);

    expect(mockFindByIdAndDelete).toHaveBeenCalledWith("song-id");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, message: "Song removed success" })
    );
  });
});
