import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useGutendexSearch } from "../features/books/hooks/useGutendexSearch";
import * as gutendexService from "../features/books/api/gutendex.service";
import { type GutendexResponse } from "../features/books/schemas/gutendex.schema";

const page1Response: GutendexResponse = {
  count: 64,
  next: "https://gutendex.com/books?page=2",
  previous: null,
  results: [
    {
      id: 1,
      title: "Frankenstein; Or, The Modern Prometheus",
      subjects: ["Science fiction"],
      authors: [
        {
          name: "Shelley, Mary Wollstonecraft",
          birth_year: 1797,
          death_year: 1851,
        },
      ],
      summaries: ["A scientist creates a living being."],
      translators: [],
      bookshelves: ["Horror"],
      languages: ["en"],
      copyright: false,
      media_type: "Text",
      formats: {
        "image/jpeg": "https://example.com/frankenstein.jpg",
      },
      download_count: 1000,
    },
  ],
};

const page2Response: GutendexResponse = {
  count: 64,
  next: null,
  previous: "https://gutendex.com/books?page=1",
  results: [
    {
      id: 2,
      title: "Dracula",
      subjects: ["Vampires"],
      authors: [
        {
          name: "Stoker, Bram",
          birth_year: 1847,
          death_year: 1912,
        },
      ],
      summaries: ["A vampire novel."],
      translators: [],
      bookshelves: ["Horror"],
      languages: ["en"],
      copyright: false,
      media_type: "Text",
      formats: {
        "image/jpeg": "https://example.com/dracula.jpg",
      },
      download_count: 900,
    },
  ],
};

describe("useGutendexSearch", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useGutendexSearch());

    expect(result.current.apiSearchTerm).toBe("");
    expect(result.current.results).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.errorMessage).toBeNull();
    expect(result.current.currentPage).toBe(1);
    expect(result.current.hasNextPage).toBe(false);
    expect(result.current.hasPreviousPage).toBe(false);
  });

  it("should update apiSearchTerm", () => {
    const { result } = renderHook(() => useGutendexSearch());

    act(() => {
      result.current.setApiSearchTerm("frankenstein");
    });

    expect(result.current.apiSearchTerm).toBe("frankenstein");
  });

  it("should search books successfully", async () => {
    vi.spyOn(gutendexService, "searchGutendexBooks").mockResolvedValue(
      page1Response,
    );

    const { result } = renderHook(() => useGutendexSearch());

    act(() => {
      result.current.setApiSearchTerm("frankenstein");
    });

    await act(async () => {
      await result.current.searchBooks();
    });

    expect(gutendexService.searchGutendexBooks).toHaveBeenCalledWith(
      expect.objectContaining({
        query: "frankenstein",
        page: 1,
      }),
    );
    expect(result.current.results).toEqual(page1Response.results);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.hasPreviousPage).toBe(false);
    expect(result.current.errorMessage).toBeNull();
  });

  it("should reset results when search term is empty", async () => {
    const { result } = renderHook(() => useGutendexSearch());

    act(() => {
      result.current.setApiSearchTerm("   ");
    });

    await act(async () => {
      await result.current.searchBooks();
    });

    expect(result.current.results).toEqual([]);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.hasNextPage).toBe(false);
    expect(result.current.hasPreviousPage).toBe(false);
    expect(result.current.errorMessage).toBeNull();
  });

  it("should handle API errors", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    vi.spyOn(gutendexService, "searchGutendexBooks").mockRejectedValue(
      new Error("Network error"),
    );

    const { result } = renderHook(() => useGutendexSearch());

    act(() => {
      result.current.setApiSearchTerm("dracula");
    });

    await act(async () => {
      await result.current.searchBooks();
    });

    expect(result.current.results).toEqual([]);
    expect(result.current.hasNextPage).toBe(false);
    expect(result.current.hasPreviousPage).toBe(false);
    expect(result.current.errorMessage).toBe(
      "An error occurred while searching books.",
    );
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it("should go to next page", async () => {
    const searchSpy = vi
      .spyOn(gutendexService, "searchGutendexBooks")
      .mockResolvedValueOnce(page1Response)
      .mockResolvedValueOnce(page2Response);

    const { result } = renderHook(() => useGutendexSearch());

    act(() => {
      result.current.setApiSearchTerm("horror");
    });

    await act(async () => {
      await result.current.searchBooks();
    });

    await act(async () => {
      await result.current.goToNextPage();
    });

    expect(searchSpy).toHaveBeenNthCalledWith(1,
      expect.objectContaining({ query: "horror", page: 1 }),
    );
    expect(searchSpy).toHaveBeenNthCalledWith(2,
      expect.objectContaining({ query: "horror", page: 2 }),
    );
    expect(result.current.results).toEqual(page2Response.results);
    expect(result.current.currentPage).toBe(2);
    expect(result.current.hasNextPage).toBe(false);
    expect(result.current.hasPreviousPage).toBe(true);
  });

  it("should go to previous page", async () => {
    const searchSpy = vi
      .spyOn(gutendexService, "searchGutendexBooks")
      .mockResolvedValueOnce(page1Response)
      .mockResolvedValueOnce(page2Response)
      .mockResolvedValueOnce(page1Response);

    const { result } = renderHook(() => useGutendexSearch());

    act(() => {
      result.current.setApiSearchTerm("horror");
    });

    await act(async () => {
      await result.current.searchBooks();
    });

    await act(async () => {
      await result.current.goToNextPage();
    });

    await act(async () => {
      await result.current.goToPreviousPage();
    });

    expect(searchSpy).toHaveBeenNthCalledWith(3,
      expect.objectContaining({ query: "horror", page: 1 }),
    );
    expect(result.current.results).toEqual(page1Response.results);
    expect(result.current.currentPage).toBe(1);
  });

  it("should not go to next page if there is no next page", async () => {
    const searchSpy = vi
      .spyOn(gutendexService, "searchGutendexBooks")
      .mockResolvedValue({
        ...page1Response,
        next: null,
      });

    const { result } = renderHook(() => useGutendexSearch());

    act(() => {
      result.current.setApiSearchTerm("frankenstein");
    });

    await act(async () => {
      await result.current.searchBooks();
    });

    await act(async () => {
      await result.current.goToNextPage();
    });

    expect(searchSpy).toHaveBeenCalledTimes(1);
    expect(result.current.currentPage).toBe(1);
  });

  it("should reset the search state", async () => {
    vi.spyOn(gutendexService, "searchGutendexBooks").mockResolvedValue(
      page1Response,
    );

    const { result } = renderHook(() => useGutendexSearch());

    act(() => {
      result.current.setApiSearchTerm("frankenstein");
    });

    await act(async () => {
      await result.current.searchBooks();
    });

    act(() => {
      result.current.resetSearch();
    });

    expect(result.current.apiSearchTerm).toBe("");
    expect(result.current.results).toEqual([]);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.hasNextPage).toBe(false);
    expect(result.current.hasPreviousPage).toBe(false);
    expect(result.current.errorMessage).toBeNull();
  });
});