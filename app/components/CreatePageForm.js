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
  const [apiResponse, setApiResponse] = useState(null);
  const [extractedWidgetIds, setExtractedWidgetIds] = useState([]);

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
    setApiResponse(null);

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

          // Extract widget IDs from the primary batch
          const widgetIds = extractWidgetIds(parsedPrimaryBatch);
          setExtractedWidgetIds(widgetIds);
          console.log("Extracted Widget IDs:", widgetIds);
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
      if (
        parsedPrimaryBatch.length === 0 &&
        parsedSecondaryBatch.length === 0
      ) {
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

      // Store the complete API response for display
      setApiResponse(result);

      // Extract page ID from various possible locations in the response
      const extractedPageId = extractPageId(result);
      setPageId(extractedPageId);

      setMessage(
        `Page "${pageTitle}" created successfully with section-by-section batch execution!`
      );
      setPageTitle("");
      console.log("Success result:", result);
    } catch (error) {
      setError(`Failed to create page: ${error.message}`);
      console.error("Error details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to extract page ID from dynamic response structure
  const extractPageId = (response) => {
    if (!response) return "No response data";

    // Try different possible locations for page ID
    const possibleIds = [
      response.pageId,
      response.id,
      response.page?.id,
      response.data?.pageId,
      response.data?.id,
      response.result?.pageId,
      response.result?.id,
    ];

    for (const id of possibleIds) {
      if (id) return id;
    }

    return "Page ID not found in response";
  };

  // Helper function to extract widget IDs from flex structure
  const extractWidgetIds = (flexStructure) => {
    if (!flexStructure || !Array.isArray(flexStructure)) return [];

    const allWidgetIds = [];

    flexStructure.forEach((section, sectionIndex) => {
      const sectionWidgets = [];

      if (section.elements && typeof section.elements === "object") {
        Object.entries(section.elements).forEach(([elementId, element]) => {
          if (
            element.type === "widget_wrapper" &&
            element.data &&
            element.data["data-widget-type"]
          ) {
            sectionWidgets.push({
              id: elementId,
              name: element.name || "Unknown Widget",
              widgetType: element.data["data-widget-type"],
              externalId: element.externalId || null,
              parentId: element.parentId || null,
            });
          }
        });
      }

      if (sectionWidgets.length > 0) {
        allWidgetIds.push({
          sectionIndex: sectionIndex + 1,
          sectionId: section.id || `section-${sectionIndex + 1}`,
          widgets: sectionWidgets,
        });
      }
    });

    return allWidgetIds;
  };

  // Helper function to render the API response structure
  const renderApiResponse = (data, depth = 0) => {
    if (!data) return null;

    const indentClass = depth > 0 ? `ml-${depth * 4}` : "";

    if (Array.isArray(data)) {
      return (
        <div className={`${indentClass} border-l-2 border-gray-200 pl-2`}>
          <span className="text-sm font-medium text-purple-600">
            Array ({data.length} items)
          </span>
          {data.map((item, index) => (
            <div key={index} className="mt-2">
              <span className="text-xs text-gray-500">[{index}]</span>
              {renderApiResponse(item, depth + 1)}
            </div>
          ))}
        </div>
      );
    }

    if (typeof data === "object" && data !== null) {
      return (
        <div className={`${indentClass} border-l-2 border-gray-200 pl-2`}>
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="mt-1">
              <span className="text-sm font-medium text-blue-600">{key}:</span>
              {typeof value === "object" ? (
                renderApiResponse(value, depth + 1)
              ) : (
                <span className="ml-2 text-sm text-gray-800">
                  {typeof value === "string" ? `"${value}"` : String(value)}
                </span>
              )}
            </div>
          ))}
        </div>
      );
    }

    return (
      <span className={`${indentClass} text-sm text-gray-800`}>
        {typeof data === "string" ? `"${data}"` : String(data)}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Create Duda Page with Dynamic Flex Structure API
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
            placeholder="Paste your primary flex structure JSON array here"
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
            Secondary Batch Request Body (JSON Array) - Optional
          </label>
          <textarea
            id="secondaryBatchBody"
            value={secondaryBatchBody}
            onChange={(e) => setSecondaryBatchBody(e.target.value)}
            placeholder="Paste your secondary flex structure JSON array here (optional)"
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Optional secondary batch for additional processing
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={
            loading ||
            !pageTitle.trim() ||
            (!primaryBatchBody.trim() && !secondaryBatchBody.trim())
          }
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Creating Page..."
            : "Create Page with Dynamic Flex Structure"}
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

      {extractedWidgetIds.length > 0 && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-yellow-800">
            Extracted Widget IDs:
          </h3>
          <div className="space-y-3">
            {extractedWidgetIds.map((section, sectionIndex) => (
              <div key={sectionIndex} className="bg-white p-3 rounded border">
                <h4 className="font-medium text-gray-700 mb-2">
                  Section {section.sectionIndex} ({section.sectionId})
                </h4>
                <div className="space-y-2">
                  {section.widgets.map((widget, widgetIndex) => (
                    <div
                      key={widgetIndex}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div>
                        <span className="font-mono text-sm text-blue-600">
                          {widget.id}
                        </span>
                        <span className="ml-2 text-sm text-gray-600">
                          ({widget.name})
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Type: {widget.widgetType} | External:{" "}
                        {widget.externalId || "None"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {apiResponse && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            API Response Structure:
          </h3>
          <div className="bg-white p-3 rounded border max-h-96 overflow-y-auto">
            {renderApiResponse(apiResponse)}
          </div>
          <div className="mt-3 text-xs text-gray-600">
            <strong>Note:</strong> This shows the complete structure of the API
            response for debugging purposes.
          </div>
        </div>
      )}
    </div>
  );
}
