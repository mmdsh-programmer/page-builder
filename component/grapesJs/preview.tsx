import { JSDOM } from "jsdom";
import React from "react";
import axios from "axios";
import fs from "fs";
import path from "path";
import { ClassObject, ComponentObject, SelectorObject, StyleObject } from "@/interface";

const Preview = async () => {
  try {
    // Read data directly from file instead of using GrapesJS
    const filePath = path.join(process.cwd(), "database.text");

    if (!fs.existsSync(filePath)) {
      throw new Error("Preview data not found");
    }

    const data = fs.readFileSync(filePath, "utf8");
    let parsedData;

    try {
      parsedData = JSON.parse(data);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      throw new Error("Invalid template data format");
    }

    // Extract HTML and CSS from parsed data
    let html = parsedData.html || "";
    let css = parsedData.css || "";

    // Fallback to legacy approach if direct HTML/CSS not available
    if (!html || !css) {
      console.log("Using fallback method to extract HTML and CSS");

      // Extract HTML from components structure as fallback
      if (
        parsedData.pages &&
        parsedData.pages[0] &&
        parsedData.pages[0].frames &&
        parsedData.pages[0].frames[0] &&
        parsedData.pages[0].frames[0].component
      ) {
        const mainComponent = parsedData.pages[0].frames[0].component;
        html = generateHtmlFromComponent(mainComponent);
      }

      // Extract CSS from styles as fallback
      if (parsedData.styles && Array.isArray(parsedData.styles)) {
        css = parsedData.styles
          .map((style: StyleObject) => {
            // Create CSS selector
            let selector = "";
            if (style.selectors) {
              selector = style.selectors
                .map((sel: string | SelectorObject) => {
                  if (typeof sel === "string") return sel;
                  return sel.private ? "." + sel.name : "#" + sel.name;
                })
                .join(", ");
            }

            // Create CSS rules
            let rules = "";
            if (style.style) {
              rules = Object.entries(style.style)
                .map(([prop, value]) => `${prop}: ${value};`)
                .join(" ");
            }

            // Check if it's a media query
            if (style.mediaText && style.atRuleType === "media") {
              return `@media ${style.mediaText} { ${selector} { ${rules} } }`;
            }

            return `${selector} { ${rules} }`;
          })
          .join("\n");
      }
    }

    // Sanitize HTML for preview
    const sanitizeHtml = html
      .replace(/<body/g, "<div")
      .replace(/<\/body>/g, "</div>");

    const fullHtml = `
      <style>${css}</style>
      ${sanitizeHtml}
    `;

    const dom = new JSDOM(`${fullHtml}`);

    // Process custom blocks
    const elements = dom.window.document.getElementsByClassName("custom-block");

    for (const el of elements) {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/todos/5"
      );
      el.innerHTML = `<div class="placeholder" style="display:flex;flex-direction:column;">
              <span>userId: ${response.data.userId}</span>
              <span>title: ${response.data.title}</span>
              <span>timestamp ${+new Date()}</span>
            </div>`;
    }

    const pageHtml = dom.serialize();
    dom.window.close();

    return (
      <div className="h-screen w-screen overflow-hidden relative">
        <div
          className="main-wrapper mx-auto"
          dangerouslySetInnerHTML={{ __html: pageHtml }}
        />
      </div>
    );
  } catch (error) {
    console.error("Preview error:", error);
    return (
      <div className="error-container p-4">
        <h2 className="text-red-500 text-xl">Error loading preview</h2>
        <p className="text-gray-700">
          {error instanceof Error ? error.message : "Unknown error occurred"}
        </p>
      </div>
    );
  }
};

// Function to recursively generate HTML from component structure
function generateHtmlFromComponent(component: ComponentObject): string {
  if (!component) return "";

  // Text node handling
  if (component.type === "textnode") {
    return component.content || "";
  }

  // Get tag name
  let tagName = component.tagName || "div";

  // Special wrapper case
  if (component.type === "wrapper") {
    tagName = "body";
  }

  // Generate attributes
  let attributes = "";
  if (component.attributes) {
    attributes = Object.entries(component.attributes)
      .map(([key, value]) => `${key}="${value}"`)
      .join(" ");
  }

  // Add classes
  let classes = "";
  if (component.classes && Array.isArray(component.classes)) {
    classes = component.classes
      .map((cls: string | ClassObject) =>
        typeof cls === "string" ? cls : cls.name
      )
      .join(" ");
  }

  if (classes) {
    attributes += ` class="${classes}"`;
  }

  // Add style
  if (component.style) {
    const styleStr = Object.entries(component.style)
      .map(([key, value]) => `${key}:${value}`)
      .join(";");
    attributes += ` style="${styleStr}"`;
  }

  // Process child components
  let childrenHtml = "";
  if (component.components && Array.isArray(component.components)) {
    childrenHtml = component.components
      .map((child: ComponentObject) => generateHtmlFromComponent(child))
      .join("");
  }

  // Return assembled HTML
  return `<${tagName} ${attributes}>${childrenHtml}</${tagName}>`;
}

export default Preview;
