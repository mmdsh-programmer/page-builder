import { Editor, Page } from "grapesjs";
import axios from "axios";

export const saveProjectData = async (
  editor: Editor
): Promise<{ success: boolean; error?: Error | unknown }> => {
  try {
    if (!editor)
      return { success: false, error: new Error("Editor not initialized") };

    const projectData = editor.getProjectData();

    const pagesHtmlArr = await getPagesHtml(editor);
    const pages = projectData.pages.map((page: Page, index: number) => {
      return {
        ...page,
        preview: pagesHtmlArr?.[index],
      }
    });

    const dataToSave = {
      ...projectData,
      pages
    };

    const response = await axios.post("/api", {
      data: dataToSave,
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

export const loadProjectData = async (
  editor: Editor
): Promise<{ success: boolean; error?: Error | unknown }> => {
  try {
    if (!editor)
      return { success: false, error: new Error("Editor not initialized") };

    const response = await axios.get("/api");
    const data = response.data;

    const projectData = data.data || data;

    editor.loadProjectData(projectData);

    setTimeout(() => {
      editor.runCommand("build-tailwind");
    }, 300);

    return { success: true };
  } catch (error) {
    console.error("Error loading project:", error);
    return { success: false, error };
  }
};

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getPagesHtml = async (editor: Editor) => {
  const pages = editor.Pages.getAll();
  const originalSelected = editor.Pages.getSelected();
  const pagesHtml = [];

  for (const page of pages) {
    editor.Pages.select(page);
    await wait(100);
    const component = page.getMainComponent();
    pagesHtml.push({
      html: editor.getHtml({ component }),
      css: editor.getCss({ component }),
      js: editor.getJs({ component }),
    });
  }

  if (originalSelected) {
    editor.Pages.select(originalSelected);
    await wait(100);
  }

  return pagesHtml;
};
