"use client";

import React, { useEffect, useState } from "react";

interface PagePreview {
  html: string;
  css: string;
  js: string;
}

interface PageData {
  name: string;
  preview: PagePreview;
}

const Preview = () => {
  const [pages, setPages] = useState<PageData[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api");
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setPages(data.pages || []);
        setLoading(false);
      } catch (err: unknown) {
        let message = "Unknown error";
        if (err instanceof Error) message = err.message;
        setError(message);
        setLoading(false);
      }
    };
    fetchPages();
  }, []);

  if (loading) {
    return <div className="w-screen h-screen flex justify-center items-center">Loading...</div>;
  }
  if (error) {
    return <div className="w-screen h-screen flex justify-center items-center text-red-500">{error}</div>;
  }
  if (!pages.length) {
    return <div className="w-screen h-screen flex justify-center items-center text-red-500">No pages to preview.</div>;
  }

  const selectedPage = pages[selectedIdx];

  return (
    <div>
      <header className="px-4 py-1 bg-[#463a3c] text-[#b9a5a6]">
        <label htmlFor="page-select" className="mr-2 font-semibold">
          Select Page:
        </label>
        <select
          id="page-select"
          value={selectedIdx}
          onChange={(e) => setSelectedIdx(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {pages.map((page, idx) => (
            <option key={idx} value={idx}>
              {page.name}
            </option>
          ))}
        </select>
      </header>
      {selectedPage && (
        <main className="preview-container bg-white">
          <style
            dangerouslySetInnerHTML={{ __html: selectedPage.preview.css }}
          />
          <div
            dangerouslySetInnerHTML={{ __html: selectedPage.preview.html }}
          />
          {selectedPage.preview.js && (
            <script
              dangerouslySetInnerHTML={{ __html: selectedPage.preview.js }}
            />
          )}
        </main>
      )}
    </div>
  );
};

export default Preview;
