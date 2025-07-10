"use client";

import { useState } from "react";

export default function CreatePageForm() {
  const [loading, setLoading] = useState(false);
  const [pageTitle, setPageTitle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pageId, setPageId] = useState("");
  const [primaryBatchBody, setPrimaryBatchBody] = useState(""); 
  const [secondaryBatchBody, setSecondaryBatchBody] = useState(""); 

  const createDudaPage = async (pageData) => {
    try {
      console.log("Making request to:", "/api/create-duda-page");
      console.log("With data:", pageData);

      const response = await fetch("/api/create-duda-page", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pageData),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(
          `API route not found. Got ${contentType} instead of JSON.`
        );
      }

      const result = await response.json();
      console.log("Response data:", result);

      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || "Unknown error occurred");
      }
    } catch (error) {
      console.error("Failed to create page:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");
    setError("");
    setPageId("");

    try {
      // Validate and parse both batch request bodies
      let parsedPrimaryBatch = [];
      let parsedSecondaryBatch = [];

      // Parse primary batch request body
      if (primaryBatchBody.trim()) {
        try {
          parsedPrimaryBatch = JSON.parse(primaryBatchBody);
          if (!Array.isArray(parsedPrimaryBatch)) {
            throw new Error("Primary batch request must be a JSON array");
          }
        } catch (e) {
          throw new Error("Invalid primary batch request JSON: " + e.message);
        }
      }

      // Parse secondary batch body if provided
      if (secondaryBatchBody.trim()) {
        try {
          parsedSecondaryBatch = JSON.parse(secondaryBatchBody);
          if (!Array.isArray(parsedSecondaryBatch)) {
            throw new Error("Secondary batch request must be a JSON array");
          }
        } catch (e) {
          throw new Error("Invalid secondary batch request JSON: " + e.message);
        }
      }

      // Validate that at least one batch request body is provided
      if (parsedPrimaryBatch.length === 0 && parsedSecondaryBatch.length === 0) {
        throw new Error("At least one batch request body must be provided");
      }

      // Send both batch bodies to the backend
      const result = await createDudaPage({
        pageTitle: pageTitle,
        pageUrl: `http://bfs._dudamobile.com/${pageTitle
          .toLowerCase()
          .replace(/\s+/g, "-")}`,
        templateName: "876004f8b5a14e25883e6e0af818572d~home",
        primaryBatchBody: parsedPrimaryBatch,
        secondaryBatchBody: parsedSecondaryBatch,
      });

      const extractedPageId =
        result.pageId || result.id || result.page?.id || "Page ID not found";
      setPageId(extractedPageId);

      setMessage(`Page "${pageTitle}" created successfully with section-by-section batch execution!`);
      setPageTitle("");
      console.log("Success result:", result);
    } catch (error) {
      setError(`Failed to create page: ${error.message}`);
      console.error("Error details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Create Duda Page with Section-by-Section Batch Execution
      </h2>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="pageTitle"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Page Title
          </label>
          <input
            id="pageTitle"
            type="text"
            value={pageTitle}
            onChange={(e) => setPageTitle(e.target.value)}
            placeholder="Enter page title"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="primaryBatchBody"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Primary Batch Request Body (JSON Array)
          </label>
          <textarea
            id="primaryBatchBody"
            value={primaryBatchBody}
            onChange={(e) => setPrimaryBatchBody(e.target.value)}
            placeholder="Paste your primary batch request JSON array here"
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            This batch will be executed first for each section
          </p>
        </div>

        <div>
          <label
            htmlFor="secondaryBatchBody"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Secondary Batch Request Body (JSON Array)
          </label>
          <textarea
            id="secondaryBatchBody"
            value={secondaryBatchBody}
            onChange={(e) => setSecondaryBatchBody(e.target.value)}
            placeholder="Paste your secondary batch request JSON array here"
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading || !pageTitle.trim() || (!primaryBatchBody.trim() && !secondaryBatchBody.trim())}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Page..." : "Create Page with Sequential Batch Execution"}
        </button>
      </div>

      {message && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
        </div>
      )}

      {pageId && (
        <div className="mt-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          <strong>Page ID:</strong> {pageId}
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
}