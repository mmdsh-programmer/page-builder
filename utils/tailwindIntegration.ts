/**
 * Tailwind CSS Integration Utilities for GrapesJS
 * This file contains helper functions to integrate Tailwind CSS with GrapesJS editor
 */
import { Editor as GrapesEditor } from "grapesjs";

/**
 * Ensures that the Tailwind CSS styles are correctly applied in the editor
 * This function adds event listeners for page changes and frame renders
 * @param editor The GrapesJS editor instance
 */
export const setupTailwindIntegration = (editor: GrapesEditor) => {
  // Make sure the Tailwind styles are applied when a new page is rendered
  editor.on("canvas:frame:load", () => {
    // The TailwindCSS plugin will already handle most of the integration
    // This is just a helper to ensure everything works correctly
    editor.runCommand("build-tailwind");
  });

  // Force a Tailwind CSS build when changing pages (if using PageManager)
  if (editor.Pages) {
    editor.on("page:select", () => {
      // Ensure Tailwind CSS is rebuilt when switching pages
      editor.runCommand("build-tailwind");
    });
  }

  // Additional events to catch when components are modified
  // This helps ensure Tailwind classes are applied when editing components
  editor.on("component:update:classes", () => {
    editor.runCommand("build-tailwind");
  });

  // When styles are changed
  editor.on("style:update", () => {
    editor.runCommand("build-tailwind");
  });

  // After components are loaded
  editor.on("components:add", () => {
    setTimeout(() => {
      editor.runCommand("build-tailwind");
    }, 500);
  });

  // After a block is dropped into the canvas
  editor.on("block:drag:stop", () => {
    setTimeout(() => {
      editor.runCommand("build-tailwind");
    }, 500);
  });
};
