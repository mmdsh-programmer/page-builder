"use client";

import React, { useEffect, useRef } from "react";
import grapesjs, { Editor as GrapesEditor } from "grapesjs";

// Import configs and utilities
import { getEditorConfig } from "@/utils/editorConfig";
import { setupComponentCSSModal } from "@/utils/componentCssManager";
import { setupIframeScrolling } from "@/utils/iframeManager";
import { setupCustomComponents, setupCustomBlocks } from "@/utils/componentsManager";
import { saveProjectData, loadProjectData } from "@/utils/projectManager";
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
        {
          id: "save-project",
          command: () => handleSaveProject(),
          className: "fa fa-floppy-o",
          attributes: { title: "Save Project" },
        },
        // Add load button
        {
          id: "load-project",
          command: () => handleLoadProject(),
          className: "fa fa-upload",
          attributes: { title: "Load Project" },
        },
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

  const handleSaveProject = async () => {
    if (!editor.current) return;
    const result = await saveProjectData(editor.current);
    if (result.success) {
      alert("Template saved successfully!");
    } else {
      console.error("Failed to save template:", result.error);
      alert("Failed to save template. Please try again.");
    }
  };

  const handleLoadProject = async () => {
    if (!editor.current) return;
    
    const result = await loadProjectData(editor.current);
    
    if (result.success) {
      alert("Template loaded successfully!");
    } else {
      console.error("Failed to load template:", result.error);
      alert("Failed to load template. Please try again.");
    }
  };

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
