import { Editor } from "grapesjs";
import axios from "axios";

/**
 * Saves the project data with circular reference handling
 */
export const saveProjectData = async (
  editor: Editor
): Promise<{ success: boolean; error?: Error | unknown }> => {
  try {
    if (!editor)
      return { success: false, error: new Error("Editor not initialized") };

    // Get the full project data (as stored in localStorage by GrapesJS)
    const projectData = editor.getProjectData();

    // Save to backend
    const response = await axios.post("/api", {
      data: projectData,
    });

    if (response.status === 200) {
      return { success: true };
    }

    return { success: false, error: new Error("Server returned an error") };
  } catch (error) {
    console.error("Error saving project:", error);
    return { success: false, error };
  }
};

/**
 * Loads project data into the editor
 */
export const loadProjectData = async (
  editor: Editor
): Promise<{ success: boolean; error?: Error | unknown }> => {
  try {
    if (!editor)
      return { success: false, error: new Error("Editor not initialized") };

    const response = await axios.get("/api");
    const data = response.data;

    // The backend returns the project data directly
    const projectData = data.data || data;

    // Load the project data into GrapesJS
    editor.loadProjectData(projectData);

    // Force rebuild of Tailwind CSS after loading project to ensure classes are applied
    setTimeout(() => {
      editor.runCommand("build-tailwind");
    }, 300);

    return { success: true };
  } catch (error) {
    console.error("Error loading project:", error);
    return { success: false, error };
  }
};
