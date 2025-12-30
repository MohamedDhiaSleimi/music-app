import { describe, it, expect, vi, beforeEach } from "vitest";
import { addAlbum, listAlbum, removeAlbum } from "../src/controllers/albumController.js";
import { createMockResponse } from "./helpers/mockResponse.js";

const mockAlbumSave = vi.fn();
const mockAlbumFind = vi.fn();
const mockAlbumFindByIdAndDelete = vi.fn();
const mockSongFind = vi.fn();
const mockSongFindByIdAndDelete = vi.fn();

vi.mock("cloudinary", () => ({
  v2: {
    uploader: {
      upload: vi.fn(async () => ({ secure_url: "https://cdn.test/album.jpg" })),
    },
  },
}));

vi.mock("../src/models/Album.js", () => {
  const Album = (data) => ({ ...data, save: mockAlbumSave });
  Album.find = mockAlbumFind;
  Album.findByIdAndDelete = mockAlbumFindByIdAndDelete;
  Album.findOne = vi.fn().mockResolvedValue({ _id: "album", name: "Album" });
  return { default: Album };
});

vi.mock("../src/models/Song.js", () => {
  const Song = () => {};
  Song.find = mockSongFind;
  Song.findByIdAndDelete = mockSongFindByIdAndDelete;
  return { default: Song };
});

describe("albumController", () => {
  beforeEach(() => {
    mockAlbumSave.mockReset();
    mockAlbumFind.mockReset();
    mockAlbumFindByIdAndDelete.mockReset();
    mockSongFind.mockReset();
    mockSongFindByIdAndDelete.mockReset();
  });

  it("adds an album with uploaded image", async () => {
    const req = {
      body: { name: "Album", desc: "Desc", bgColour: "#000" },
      file: { path: "/tmp/image" },
    };
    const res = createMockResponse();

    await addAlbum(req, res);

    expect(mockAlbumSave).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("lists albums", async () => {
    mockAlbumFind.mockResolvedValueOnce([{ name: "A" }]);
    const res = createMockResponse();

    await listAlbum({}, res);

    expect(mockAlbumFind).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, albums: [{ name: "A" }] })
    );
  });

  it("removes album and related songs", async () => {
    mockSongFind.mockResolvedValueOnce([{ _id: "s1" }, { _id: "s2" }]);
    const res = createMockResponse();
    const req = { params: { id: "album-id" } };

    await removeAlbum(req, res);

    expect(mockSongFind).toHaveBeenCalled();
    expect(mockSongFindByIdAndDelete).toHaveBeenCalledTimes(2);
    expect(mockAlbumFindByIdAndDelete).toHaveBeenCalledWith("album-id");
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
