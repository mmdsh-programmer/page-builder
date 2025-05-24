import { Editor } from "grapesjs";

/**
 * Saves project data by handling circular references
 */
export const getProjectData = async (editor: Editor) => {
  try {
    // Get necessary data from the editor
    const html = editor.getHtml();
    const css = editor.getCss();
    const js = editor.getJs ? editor.getJs() : "";

    // Components and styles need special handling to avoid circular references
    const components = JSON.stringify(editor.getComponents());
    const styles = JSON.stringify(editor.getStyle());

    // Form the data to be saved
    const projectData = {
      html,
      css,
      js,
      components,
      styles,
    };

    // Save to your API or storage
    const response = await fetch("/api/save-template", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectData),
    });

    if (response.ok) {
      // Success notification can be handled by the caller
      return { success: true };
    } else {
      throw new Error("Failed to save project");
    }
  } catch (error) {
    console.error("Error saving project:", error);
    return { success: false, error };
  }
};

/**
 * Fixes iframe scrolling issue in GrapesJS editor
 */
export const fixIframeScrolling = (editor: Editor) => {
  const canvas = editor.Canvas;
  const bodyEl = canvas.getBody();

  if (bodyEl) {
    bodyEl.style.position = "initial";
    bodyEl.style.overflow = "auto";
  }
};

/**
 * Loads a project into the editor
 */
export const loadProject = async (editor: Editor) => {
  try {
    const response = await fetch("/api/load-template");

    if (!response.ok) {
      throw new Error("Failed to load project");
    }

    const projectData = await response.json();

    // Load HTML and CSS
    editor.setComponents(projectData.html || "");
    editor.setStyle(projectData.css || "");

    // Handle JavaScript - store it in a custom property if needed
    // GrapesJS doesn't have a built-in setJs method, so you'll need to
    // implement custom JS handling in your application
    if (projectData.js) {
      // Store JS in editor's custom data or use a plugin that handles JS
      editor.getModel().set("jsCode", projectData.js);
    }

    return { success: true };
  } catch (error) {
    console.error("Error loading project:", error);
    return { success: false, error };
  }
};
