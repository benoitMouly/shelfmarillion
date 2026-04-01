import { describe, expect, it, vi, afterEach, beforeEach } from "vitest";
import { searchGutendexBooks, GutendexApiError, clearSearchCache } from "../features/books/api/gutendex.service";

beforeEach(() => {
  // The cache is a module-level singleton — we clear it before each test
  // to ensure isolation and prevent a cache hit from skewing assertions.
  clearSearchCache();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("searchGutendexBooks", () => {
  it("returns empty response when query is blank or whitespace", async () => {
    const res = await searchGutendexBooks({ query: "   " });
    expect(res).toEqual({ count: 0, next: null, previous: null, results: [] });
  });

  it("throws GutendexApiError when fetch response is not ok", async () => {
  // stub a fetch that returns not-ok
  vi.stubGlobal("fetch", vi.fn(() => Promise.resolve({ ok: false })));

  await expect(searchGutendexBooks({ query: "hobbit" })).rejects.toBeInstanceOf(GutendexApiError);

    // ensure fetch was called once
    expect(
      ((globalThis as unknown) as { fetch?: (...args: unknown[]) => unknown }).fetch
    ).toHaveBeenCalledTimes(1);
  });

  it("fetches and returns parsed Gutendex response when fetch is ok", async () => {
    const sample = {
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          id: 123,
          title: "A Sample Book",
          subjects: ["Fiction"],
          authors: [
            { name: "An Author", birth_year: null, death_year: null }
          ],
          summaries: ["summary"],
          translators: [],
          bookshelves: [],
          languages: ["en"],
          copyright: null,
          media_type: "Text",
          formats: { "text/plain": "http://example.com" },
          download_count: 42,
        },
      ],
    };

    const fetchMock = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(sample) })
    );

  vi.stubGlobal("fetch", fetchMock);

  const res = await searchGutendexBooks({ query: " sample ", page: 2 });

    expect(res).toEqual(sample);

    // verify fetch called with a URL containing the trimmed search and page=2
    expect(fetchMock).toHaveBeenCalledTimes(1);
  const calls = (fetchMock as unknown as { mock?: { calls?: unknown[][] } }).mock?.calls ?? [];
  const calledWith = String((calls[0]?.[0]) ?? "");
  expect(calledWith).toContain("search=sample");
  expect(calledWith).toContain("page=2");
  });

  it("returns cached result on second call without hitting the network", async () => {
    const sample = {
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          id: 1,
          title: "Cached Book",
          subjects: [],
          authors: [{ name: "Author", birth_year: null, death_year: null }],
          summaries: [],
          translators: [],
          bookshelves: [],
          languages: ["en"],
          copyright: null,
          media_type: "Text",
          formats: {},
          download_count: 0,
        },
      ],
    };

    const fetchMock = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(sample) })
    );
    vi.stubGlobal("fetch", fetchMock);

    // Premier appel — réseau sollicité
    const first = await searchGutendexBooks({ query: "cached", page: 1 });
    // Second appel identique — doit retourner le cache sans fetch
    const second = await searchGutendexBooks({ query: "cached", page: 1 });

    expect(first).toEqual(sample);
    expect(second).toEqual(sample);
    // fetch ne doit avoir été appelé qu'une seule fois
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("does not use cache for different pages of the same query", async () => {
    const makeResponse = (id: number) => ({
      count: 2,
      next: null,
      previous: null,
      results: [
        {
          id,
          title: `Book ${id}`,
          subjects: [],
          authors: [{ name: "Author", birth_year: null, death_year: null }],
          summaries: [],
          translators: [],
          bookshelves: [],
          languages: ["en"],
          copyright: null,
          media_type: "Text",
          formats: {},
          download_count: 0,
        },
      ],
    });

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(makeResponse(1)) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(makeResponse(2)) });

    vi.stubGlobal("fetch", fetchMock);

    const page1 = await searchGutendexBooks({ query: "multi", page: 1 });
    const page2 = await searchGutendexBooks({ query: "multi", page: 2 });

    expect(page1.results[0]?.id).toBe(1);
    expect(page2.results[0]?.id).toBe(2);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
