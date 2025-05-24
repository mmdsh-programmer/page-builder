import { Editor } from "grapesjs";

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
  editor.DomComponents.addType("link", {
    model: {
      defaults: {
        droppable: true,
        draggable: ":not(a)",
        components: [
          {
            type: "text",
            content: "Link text",
          },
        ],
      },
    },
  });

  // Ensure all text components are editable
  editor.DomComponents.addType("text", {
    model: {
      defaults: {
        editable: true,
      },
    },
  });

  // Allow children inside <li> blocks
  editor.DomComponents.addType("li", {
    model: {
      defaults: {
        droppable: true,
        draggable: true,
      },
    },
  });

  // Allow <ul> blocks to contain <li> blocks
  editor.DomComponents.addType("ul", {
    model: {
      defaults: {
        droppable: "li",
        draggable: true,
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
    content: {
      type: "text",
      tagName: "h1",
      content: "Heading 1",
    },
    media:
      '<svg viewBox="0 0 24 24"><path d="M3 4h18v2H3V4zm0 14h18v2H3v-2zm0-7h18v2H3v-2z"></path><text x="12" y="16" text-anchor="middle" font-size="12" font-weight="bold">H1</text></svg>',
  });

  editor.BlockManager.add("heading2", {
    label: "H2 Heading",
    category: "Basic",
    content: {
      type: "text",
      tagName: "h2",
      content: "Heading 2",
    },
    media:
      '<svg viewBox="0 0 24 24"><path d="M3 4h18v2H3V4zm0 14h18v2H3v-2zm0-7h18v2H3v-2z"></path><text x="12" y="16" text-anchor="middle" font-size="10" font-weight="bold">H2</text></svg>',
  });

  editor.BlockManager.add("heading3", {
    label: "H3 Heading",
    category: "Basic",
    content: {
      type: "text",
      tagName: "h3",
      content: "Heading 3",
    },
    media:
      '<svg viewBox="0 0 24 24"><path d="M3 4h18v2H3V4zm0 14h18v2H3v-2zm0-7h18v2H3v-2z"></path><text x="12" y="16" text-anchor="middle" font-size="9" font-weight="bold">H3</text></svg>',
  });

  editor.BlockManager.add("heading4", {
    label: "H4 Heading",
    category: "Basic",
    content: {
      type: "text",
      tagName: "h4",
      content: "Heading 4",
    },
    media:
      '<svg viewBox="0 0 24 24"><path d="M3 4h18v2H3V4zm0 14h18v2H3v-2zm0-7h18v2H3v-2z"></path><text x="12" y="16" text-anchor="middle" font-size="8" font-weight="bold">H4</text></svg>',
  });

  editor.BlockManager.add("heading5", {
    label: "H5 Heading",
    category: "Basic",
    content: {
      type: "text",
      tagName: "h5",
      content: "Heading 5",
    },
    media:
      '<svg viewBox="0 0 24 24"><path d="M3 4h18v2H3V4zm0 14h18v2H3v-2zm0-7h18v2H3v-2z"></path><text x="12" y="16" text-anchor="middle" font-size="7" font-weight="bold">H5</text></svg>',
  });

  editor.BlockManager.add("heading6", {
    label: "H6 Heading",
    category: "Basic",
    content: {
      type: "text",
      tagName: "h6",
      content: "Heading 6",
    },
    media:
      '<svg viewBox="0 0 24 24"><path d="M3 4h18v2H3V4zm0 14h18v2H3v-2zm0-7h18v2H3v-2z"></path><text x="12" y="16" text-anchor="middle" font-size="6" font-weight="bold">H6</text></svg>',
  });

  editor.BlockManager.add("section", {
    label: "Section",
    category: "Basic",
    content: () => {
      // Generate a unique class for each section
      const uniqueClass = `section-${Math.random().toString(36).substr(2, 9)}`;
      return `<section class="${uniqueClass}"><p>section</p></section>`;
    },
    media:
      '<svg viewBox="0 0 24 24" width="24" height="24"><rect x="3" y="5" width="18" height="14" rx="2" fill="#e5e7eb" stroke="#374151" stroke-width="1.5"/><rect x="3" y="5" width="18" height="4" rx="1" fill="#6366f1"/><text x="12" y="14" text-anchor="middle" font-size="7" font-weight="bold" fill="#374151">Sec</text></svg>',
  });

  editor.BlockManager.add("div", {
    label: "Div",
    category: "Basic",
    content: () => {
      // Generate a unique class for each div
      const uniqueClass = `div-${Math.random().toString(36).substr(2, 9)}`;
      return `<div class="${uniqueClass}"><p>div</p></div>`;
    },
    media:
      '<svg viewBox="0 0 24 24" width="24" height="24"><rect x="3" y="5" width="18" height="14" rx="2" fill="#e5e7eb" stroke="#374151" stroke-width="1.5"/><rect x="3" y="5" width="18" height="4" rx="1" fill="#6366f1"/><text x="12" y="14" text-anchor="middle" font-size="7" font-weight="bold" fill="#374151">Div</text></svg>',
  });

  editor.BlockManager.add("paragraph", {
    label: "Paragraph",
    category: "Basic",
    content: {
      type: "text",
      tagName: "p",
      content: "This is a paragraph.",
    },
    media:
      '<svg viewBox="0 0 24 24" width="24" height="24"><rect x="3" y="5" width="18" height="14" rx="2" fill="#e5e7eb" stroke="#374151" stroke-width="1.5"/><rect x="3" y="5" width="18" height="4" rx="1" fill="#6366f1"/><text x="12" y="14" text-anchor="middle" font-size="7" font-weight="bold" fill="#374151">P</text></svg>',
  });

  editor.BlockManager.add("footer", {
    label: "Footer",
    category: "Basic",
    content: `
      <footer></footer>
    `,
    media:
      '<svg viewBox="0 0 24 24" width="24" height="24"><rect x="2" y="17" width="20" height="5" rx="2" fill="#111827" stroke="#374151" stroke-width="1.5"/><text x="12" y="21" text-anchor="middle" font-size="7" font-weight="bold" fill="#fff">Footer</text></svg>',
  });

  editor.BlockManager.add("list", {
    label: "List",
    category: "Basic",
    content: {
      type: "ul",
      components: [
        { type: "li", components: [{ type: "text", content: "First item" }] },
        { type: "li", components: [{ type: "text", content: "Second item" }] },
        { type: "li", components: [{ type: "text", content: "Third item" }] },
      ],
    },
    media:
      '<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="6" cy="7" r="2" fill="#6366f1"/><circle cx="6" cy="12" r="2" fill="#6366f1"/><circle cx="6" cy="17" r="2" fill="#6366f1"/><rect x="10" y="6" width="10" height="2" rx="1" fill="#e5e7eb"/><rect x="10" y="11" width="10" height="2" rx="1" fill="#e5e7eb"/><rect x="10" y="16" width="10" height="2" rx="1" fill="#e5e7eb"/></svg>',
  });
};
