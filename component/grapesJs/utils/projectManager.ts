import { Editor } from 'grapesjs';
import axios from 'axios';

/**
 * Saves the project data with circular reference handling
 */
export const saveProjectData = async (editor: Editor): Promise<{ success: boolean; error?: Error | unknown }> => {
  try {
    if (!editor) return { success: false, error: new Error('Editor not initialized') };

    // Extract HTML and CSS separately for easier rendering in preview
    const html = editor.getHtml();
    const css = editor.getCss();
    const js = editor.getJs ? editor.getJs() : '';

    // Get components and styles but handle circular references
    const components = JSON.stringify(editor.getComponents());
    const styles = JSON.stringify(editor.getStyle());

    // Create enhanced data object with both project data and extracted HTML/CSS
    const enhancedData = {
      html,
      css,
      js,
      components,
      styles
    };

    const response = await axios.post("/api", {
      data: enhancedData,
    });
    
    if (response.status === 200) {
      return { success: true };
    }
    
    return { success: false, error: new Error('Server returned an error') };
  } catch (error) {
    console.error('Error saving project:', error);
    return { success: false, error };
  }
};

/**
 * Loads project data into the editor
 */
export const loadProjectData = async (editor: Editor): Promise<{ success: boolean; error?: Error | unknown }> => {
  try {
    if (!editor) return { success: false, error: new Error('Editor not initialized') };
    
    const response = await axios.get("/api");
    const data = response.data;
    
    // Handle different ways data might be stored
    const projectData = data.data || data;
    
    if (typeof projectData.components === 'string') {
      try {
        projectData.components = JSON.parse(projectData.components);
      } catch (e) {
        console.warn('Error parsing components JSON:', e);
      }
    }
    
    if (typeof projectData.styles === 'string') {
      try {
        projectData.styles = JSON.parse(projectData.styles);
      } catch (e) {
        console.warn('Error parsing styles JSON:', e);
      }
    }
    
    editor.loadProjectData(projectData);
    
    // Force rebuild of Tailwind CSS after loading project to ensure classes are applied
    setTimeout(() => {
      editor.runCommand('build-tailwind');
    }, 300);
    
    return { success: true };
  } catch (error) {
    console.error('Error loading project:', error);
    return { success: false, error };
  }
}; 