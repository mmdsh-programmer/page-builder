import { Editor } from "grapesjs";

/**
 * Configures panels for the GrapesJS editor
 */
export const setupPanels = (editor: Editor) => {
  const panelManager = editor.Panels;

  // Remove unwanted panels
  const panelsToRemove = ["devices-c", "panel-switcher"];
  panelsToRemove.forEach((panel) => panelManager.removePanel(panel));

  // Add custom panels if needed
  // panelManager.addPanel({
  //   id: 'custom-panel',
  //   visible: true,
  //   buttons: [/* buttons config */]
  // });

  return panelManager;
};

/**
 * Adds custom buttons to panels
 */
export const addCustomButtons = (editor: Editor) => {
  const panelManager = editor.Panels;

  // Example: Add a save button to the options panel
  panelManager.addButton("options", {
    id: "save-btn",
    className: "fa fa-floppy-o",
    command: "save-project",
    attributes: { title: "Save Project" },
  });

  // Example: Add a preview button
  panelManager.addButton("options", {
    id: "preview-btn",
    className: "fa fa-eye",
    command: "preview",
    attributes: { title: "Preview" },
  });
};

/**
 * Sets up commands for buttons
 */
export const setupCommands = (
  editor: Editor,
  callbacks: {
    onSave?: () => void;
    onPreview?: () => void;
  } = {}
) => {
  const commandManager = editor.Commands;

  // Setup save command
  commandManager.add("save-project", {
    run: () => {
      if (callbacks.onSave) {
        callbacks.onSave();
      }
      return true;
    },
  });

  // Setup preview command
  commandManager.add("preview", {
    run: () => {
      if (callbacks.onPreview) {
        callbacks.onPreview();
      }
      return true;
    },
  });
};
