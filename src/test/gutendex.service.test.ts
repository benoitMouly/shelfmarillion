import { describe, expect, it, vi, afterEach } from "vitest";
import { searchGutendexBooks, GutendexApiError } from "../features/books/api/gutendex.service";

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
});
