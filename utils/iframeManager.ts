import { Editor } from "grapesjs";

/**
 * Fixes iframe scrolling issues in the GrapesJS editor
 */
export const fixIframeScrolling = (editor: Editor): boolean => {
  try {
    // Get the iframe element
    const iframe = editor.Canvas.getFrameEl();
    if (!iframe) return false;

    // Make the iframe's content scrollable
    iframe.style.overflow = "auto";

    // Access the iframe's document and body
    const iframeWindow = iframe.contentWindow;
    if (!iframeWindow) return false;

    const iframeDoc = iframe.contentDocument || iframeWindow.document;
    const iframeHtml = iframeDoc.documentElement;
    const iframeBody = iframeDoc.body;

    // Apply styles to the html element
    iframeHtml.style.height = "100%";
    iframeHtml.style.overflowY = "auto";

    // Apply styles to the body element
    iframeBody.style.height = "auto";
    iframeBody.style.minHeight = "100%";

    // Create and append a style element
    const styleEl = iframeDoc.createElement("style");
    styleEl.textContent = `
      html { height: 100% !important; overflow-y: auto !important; }
      body { height: auto !important; min-height: 100% !important; overflow-y: auto !important; }
    `;
    iframeDoc.head.appendChild(styleEl);

    return true;
  } catch (err) {
    console.error("Error fixing iframe scroll:", err);
    return false;
  }
};

/**
 * Sets up the iframe scrolling fix and observers for the GrapesJS editor
 */
export const setupIframeScrolling = (editor: Editor) => {
  // Add custom command to fix iframe scrolling
  editor.Commands.add("fix-iframe-scroll", {
    run: () => fixIframeScrolling(editor),
  });

  // Run the command on canvas load
  editor.on("canvas:load", () => {
    editor.runCommand("fix-iframe-scroll");

    // Create a MutationObserver to watch for changes in the iframe
    try {
      const canvas = editor.Canvas;
      const iframe = canvas.getFrameEl();

      if (iframe && iframe.contentWindow && iframe.contentDocument) {
        const observer = new MutationObserver(() => {
          // Re-apply scroll fix when content changes
          editor.runCommand("fix-iframe-scroll");
        });

        // Start observing the iframe body for structure changes
        observer.observe(iframe.contentDocument.body, {
          childList: true,
          subtree: true,
          attributes: false,
          characterData: false,
        });
      }
    } catch (err) {
      console.error("Error setting up MutationObserver:", err);
    }
  });
};
