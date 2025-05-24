"use client";

import React, { useEffect, useRef } from "react";
import grapesjs, { Editor as GrapesEditor } from "grapesjs";

// Import configs and utilities
import { getEditorConfig } from "@/utils/editorConfig";
import { setupComponentCSSModal } from "@/utils/componentCssManager";
import { setupIframeScrolling } from "@/utils/iframeManager";
import { setupCustomComponents, setupCustomBlocks } from "@/utils/componentsManager";
import { setupEditorStyles } from "@/utils/cssManager";
import { openPreviewInNewTab, showPreviewInModal } from "@/utils/previewManager";
import { setupTailwindIntegration } from "@/utils/tailwindIntegration";
import PageManager from "./pageManager";

const Editor = () => {
  const editor = useRef<GrapesEditor | null>(null);
  const [pageManagerOpen, setPageManagerOpen] = React.useState(false);
  
  useEffect(() => {
    if (editor.current) return;
    
    // Initialize the editor with the configuration
    editor.current = grapesjs.init(getEditorConfig());
    
    const currentEditor = editor.current;
    
    // Set up all editor extensions and utilities
    setupComponentCSSModal(currentEditor);
    setupIframeScrolling(currentEditor);
    setupCustomComponents(currentEditor);
    setupCustomBlocks(currentEditor);
    setupEditorStyles(currentEditor);
    setupTailwindIntegration(currentEditor);
    
    // Force initial build of Tailwind CSS to ensure classes are applied
    setTimeout(() => {
      currentEditor.runCommand('build-tailwind');
    }, 500);
    
    // Add device manager buttons
    const panelDevices = currentEditor.Panels.addPanel({
      id: "devices-c",
      visible: true,
      buttons: [],
    });

    const buttons = panelDevices.get("buttons");
    if (buttons) {
      buttons.add([
        // Add preview button
        {
          id: "preview-static",
          command: () => handlePreview(),
          className: "fa fa-eye",
          attributes: { title: "Preview" },
        },
        // Add in-editor preview button
        {
          id: "preview-modal",
          command: () => handlePreviewInModal(),
          className: "fa fa-window-maximize",
          attributes: { title: "Quick Preview" },
        },
        {
          id: "custom-css-btn",
          className: "fa fa-css3",
          command: "open-custom-css",
          attributes: { title: "Custom CSS" },
        },
      ]);
    }

    // Add a button to open the page manager
    currentEditor.Panels.addButton('views', {
      id: 'open-pages',
      className: 'fa fa-file-o',
      attributes: { title: 'Manage Pages' },
      command: () => setPageManagerOpen(true),
      togglable: false,
    });
  }, []);

  // Auto-load on mount
  useEffect(() => {
    const autoLoad = async () => {
      if (!editor.current) return;
      const ed = editor.current;
      try {
        const res = await fetch('/api');
        if (!res.ok) return;
        const data = await res.json();
        if (data.pages && Array.isArray(data.pages)) {
          ed.Pages.getAll().forEach(page => ed.Pages.remove(String(page.id)));
          data.pages.forEach((page: {id: string|number, name: string, component: string, styles: string}) => {
            ed.Pages.add({
              id: String(page.id),
              name: page.name,
              component: page.component,
              styles: page.styles,
            });
          });
          if (data.pages.length > 0) ed.Pages.select(String(data.pages[0].id));
        }
      } catch {
        // Silent fail
      }
    };
    autoLoad();
  }, []);

  // Auto-save on any editor change
  useEffect(() => {
    if (!editor.current) return;
    const ed = editor.current;
    const autoSave = async () => {
      const pages = ed.Pages.getAll().map(page => ({
        id: String(page.id),
        name: String(page.get('name')),
        component: ed.getHtml({ component: page.getMainComponent() }),
        styles: ed.getCss({ component: page.getMainComponent() }),
      }));
      try {
        await fetch('/api', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: { pages } }),
        });
      } catch {}
    };
    ed.on('change', autoSave);
    return () => {
      ed.off('change', autoSave);
    };
  }, [editor.current]);

  const handlePreview = () => {
    openPreviewInNewTab();
  };

  const handlePreviewInModal = () => {
    if (!editor.current) return;
    showPreviewInModal(editor.current);
  };

  return (
    <div className="GrapesjsApp h-screen w-screen flex flex-col overflow-hidden">
      <div className="Editor-content flex-grow overflow-hidden relative">
        <div id="gjs" className="!h-full w-full absolute inset-0" />
        <PageManager editor={editor.current} open={pageManagerOpen} onClose={() => setPageManagerOpen(false)} />
      </div>
    </div>
  );
};

export default Editor;
