import { Editor } from 'grapesjs';

/**
 * Setup custom component types
 */
export const setupCustomComponents = (editor: Editor) => {
  // Add a component type that ensures scrollable containers
  editor.DomComponents.addType("scrollable", {
    model: {
      defaults: {
        attributes: { class: "scrollable-component" },
        style: {
          "overflow-y": "auto",
          "min-height": "100px",
        },
      },
    },
  });
};

/**
 * Setup custom blocks for the editor
 */
export const setupCustomBlocks = (editor: Editor) => {
  // Add a block for scrollable containers
  editor.BlockManager.add("scrollable-container", {
    label: "Scrollable Container",
    category: "Basic",
    content: {
      type: "scrollable",
      content: "<div>Add content here that can scroll</div>",
      style: {
        "min-height": "200px",
        "max-height": "400px",
        "overflow-y": "auto",
        border: "1px solid #ccc",
        padding: "10px",
      },
    },
  });
}; 