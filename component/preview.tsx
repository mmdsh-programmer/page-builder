"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const Preview = () => {
  const [html, setHtml] = useState<string>("");
  const [css, setCss] = useState<string>("");
  const [js, setJs] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api");
        const data = response.data.data || response.data;
        
        setHtml(data.html || "");
        setCss(data.css || "");
        setJs(data.js || "");
        setLoading(false);
      } catch (err) {
        console.error("Failed to load preview data:", err);
        setError("Failed to load preview data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="spinner-border mb-3" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p>Loading preview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="preview-container">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
      {js && <script dangerouslySetInnerHTML={{ __html: js }} />}
    </div>
  );
};

export default Preview;
