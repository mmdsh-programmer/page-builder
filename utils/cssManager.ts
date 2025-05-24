import { Editor } from "grapesjs";

/**
 * Adds custom CSS to the editor
 */
export const addCustomCSS = (editor: Editor, css: string) => {
  try {
    // Check if Canvas exists and is ready
    if (!editor.Canvas) {
      console.warn("Canvas not initialized yet");
      return;
    }

    const doc = editor.Canvas.getDocument();

    // Check if document and head exist
    if (!doc || !doc.head) {
      console.warn("Document or head not available yet");
      return;
    }

    const head = doc.head;
    const style = document.createElement("style");

    style.innerHTML = css;
    style.id = "custom-editor-css";

    // Remove existing custom CSS if it exists
    const existingStyle = head.querySelector("#custom-editor-css");
    if (existingStyle) {
      existingStyle.remove();
    }

    head.appendChild(style);
  } catch (err) {
    console.error("Error adding custom CSS:", err);
  }
};

/**
 * Adds custom styles to the editor frame
 */
export const setupEditorStyles = (editor: Editor) => {
  // Add custom styles to editor when the canvas is loaded
  editor.on("canvas:load", () => {
    // Add custom styles to editor
    const customCSS = `
      body { background-color: #f5f5f5; }
      .gjs-dashed .gjs-block { border: 1px dashed #ccc; }
      .gjs-dashed .gjs-block:hover { box-shadow: 0 0 5px rgba(0,0,0,0.2); }
    `;

    addCustomCSS(editor, customCSS);
  });
};

/**
 * Gets the CSS from the editor
 */
export const getEditorCSS = (editor: Editor): string => {
  const css = editor.getCss();
  return css || "";
};

/**
 * Sets CSS in the editor
 */
export const setEditorCSS = (editor: Editor, css: string) => {
  // Wait until the canvas is loaded
  if (editor.Canvas && editor.Canvas.getDocument()) {
    addCustomCSS(editor, css);
  } else {
    // If canvas is not ready, set up a one-time event listener
    editor.once("canvas:load", () => {
      addCustomCSS(editor, css);
    });
  }
};
