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

  // Allow children inside <a> (link) blocks
  editor.DomComponents.addType('link', {
    model: {
      defaults: {
        droppable: true,
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

  // Add simple heading blocks with distinct icons
  editor.BlockManager.add("heading1", {
    label: "H1 Heading",
    category: "Basic",
    content: '<h1>Heading 1</h1>',
    media: '<svg viewBox="0 0 24 24"><path d="M3 4h18v2H3V4zm0 14h18v2H3v-2zm0-7h18v2H3v-2z"></path><text x="12" y="16" text-anchor="middle" font-size="12" font-weight="bold">H1</text></svg>'
  });

  editor.BlockManager.add("heading2", {
    label: "H2 Heading",
    category: "Basic",
    content: '<h2>Heading 2</h2>',
    media: '<svg viewBox="0 0 24 24"><path d="M3 4h18v2H3V4zm0 14h18v2H3v-2zm0-7h18v2H3v-2z"></path><text x="12" y="16" text-anchor="middle" font-size="10" font-weight="bold">H2</text></svg>'
  });

  editor.BlockManager.add("heading3", {
    label: "H3 Heading",
    category: "Basic",
    content: '<h3>Heading 3</h3>',
    media: '<svg viewBox="0 0 24 24"><path d="M3 4h18v2H3V4zm0 14h18v2H3v-2zm0-7h18v2H3v-2z"></path><text x="12" y="16" text-anchor="middle" font-size="9" font-weight="bold">H3</text></svg>'
  });
  
  editor.BlockManager.add("heading4", {
    label: "H4 Heading",
    category: "Basic",
    content: '<h4>Heading 4</h4>',
    media: '<svg viewBox="0 0 24 24"><path d="M3 4h18v2H3V4zm0 14h18v2H3v-2zm0-7h18v2H3v-2z"></path><text x="12" y="16" text-anchor="middle" font-size="8" font-weight="bold">H4</text></svg>'
  });
  
  editor.BlockManager.add("heading5", {
    label: "H5 Heading",
    category: "Basic",
    content: '<h5>Heading 5</h5>',
    media: '<svg viewBox="0 0 24 24"><path d="M3 4h18v2H3V4zm0 14h18v2H3v-2zm0-7h18v2H3v-2z"></path><text x="12" y="16" text-anchor="middle" font-size="7" font-weight="bold">H5</text></svg>'
  });
  
  editor.BlockManager.add("heading6", {
    label: "H6 Heading",
    category: "Basic",
    content: '<h6>Heading 6</h6>',
    media: '<svg viewBox="0 0 24 24"><path d="M3 4h18v2H3V4zm0 14h18v2H3v-2zm0-7h18v2H3v-2z"></path><text x="12" y="16" text-anchor="middle" font-size="6" font-weight="bold">H6</text></svg>'
  });
}; 