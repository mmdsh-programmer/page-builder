"use client";

import React, { useEffect, useRef } from "react";

import axios from "axios";
import gjsForms from "grapesjs-plugin-forms";
import gjsPresetWebpage from "grapesjs-preset-webpage";
import grapesjs, { Editor as GrapesEditor } from "grapesjs";
import grapesjsBlocksBasic from "grapesjs-blocks-basic";
import columnSystem from "../../plugins/columnSystem";

const Editor = () => {
  const editor = useRef<GrapesEditor | null>(null);
  useEffect(() => {
    if (editor.current) return;
    editor.current = grapesjs.init({
      container: "#gjs",
      fromElement: false,
      storageManager: {
        type: "none", // Explicitly disable storage
        autosave: false
      },
      plugins: [
        grapesjsBlocksBasic, 
        gjsPresetWebpage, 
        gjsForms,
        columnSystem
      ],
      pluginsOpts: {
        swiperComponent: {},
        columnSystem: {
          category: 'Layout',
          flexLabel: 'Flex Row',
          gridLabel: 'Grid Row'
        }
      },
      // Configure asset manager
      assetManager: {
        assets: [],
        dropzone: true,
        upload: '/api/upload-asset', // Endpoint for asset uploads
      },
      // Configure style manager with common properties
      styleManager: {
        sectors: [
          {
            name: 'Dimension',
            open: false,
            buildProps: ['width', 'height', 'min-width', 'min-height', 'max-width', 'max-height', 'padding', 'margin'],
          },
          {
            name: 'Typography',
            open: false,
            buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-decoration', 'text-shadow'],
          },
          {
            name: 'Decorations',
            open: false,
            buildProps: ['background-color', 'border', 'border-radius', 'box-shadow'],
          },
        ],
      },
      canvas: {
        styles:["http://localhost:3000/swiper-bundle.min.css", "http://localhost:3000/custom.css"],
        scripts: ["http://localhost:3000/swiper-bundle.min.js"],
      },
    });

    // Add custom command to fix iframe scrolling
    editor.current.Commands.add('fix-iframe-scroll', {
      run: (editor) => {
        try {
          // Get the iframe element
          const iframe = editor.Canvas.getFrameEl();
          if (!iframe) return;
          
          // Make the iframe's content scrollable
          iframe.style.overflow = 'auto';
          
          // Access the iframe's document and body
          const iframeWindow = iframe.contentWindow;
          if (!iframeWindow) return false;
          
          const iframeDoc = iframe.contentDocument || iframeWindow.document;
          const iframeHtml = iframeDoc.documentElement;
          const iframeBody = iframeDoc.body;
          
          // Apply styles to the html element
          iframeHtml.style.height = '100%';
          iframeHtml.style.overflowY = 'auto';
          
          // Apply styles to the body element
          iframeBody.style.height = 'auto';
          iframeBody.style.minHeight = '100%';
          
          // Create and append a style element
          const styleEl = iframeDoc.createElement('style');
          styleEl.textContent = `
            html { height: 100% !important; overflow-y: auto !important; }
            body { height: auto !important; min-height: 100% !important; overflow-y: auto !important; }
          `;
          iframeDoc.head.appendChild(styleEl);
          
          return true;
        } catch (err) {
          console.error('Error fixing iframe scroll:', err);
          return false;
        }
      }
    });
    
    // Run the command on canvas load
    editor.current.on('canvas:load', () => {
      if (editor.current) {
        editor.current.runCommand('fix-iframe-scroll');
        
        // Create a MutationObserver to watch for changes in the iframe
        try {
          const canvas = editor.current.Canvas;
          const iframe = canvas.getFrameEl();
          
          if (iframe && iframe.contentWindow && iframe.contentDocument) {
            const observer = new MutationObserver(() => {
              // Re-apply scroll fix when content changes
              editor.current?.runCommand('fix-iframe-scroll');
            });
            
            // Start observing the iframe body for structure changes
            observer.observe(iframe.contentDocument.body, {
              childList: true,
              subtree: true,
              attributes: false,
              characterData: false
            });
          }
        } catch (err) {
          console.error('Error setting up MutationObserver:', err);
        }
      }
    });

    // Add a component type that ensures scrollable containers
    editor.current.DomComponents.addType('scrollable', {
      model: {
        defaults: {
          attributes: { class: 'scrollable-component' },
          style: {
            'overflow-y': 'auto',
            'min-height': '100px',
          },
        }
      }
    });
    
    // Add a block for scrollable containers
    editor.current.BlockManager.add('scrollable-container', {
      label: 'Scrollable Container',
      category: 'Basic',
      content: {
        type: 'scrollable',
        content: '<div>Add content here that can scroll</div>',
        style: {
          'min-height': '200px',
          'max-height': '400px',
          'overflow-y': 'auto',
          'border': '1px solid #ccc',
          'padding': '10px'
        }
      }
    });

    // Add device manager buttons
    const panelDevices = editor.current.Panels.addPanel({
      id: 'devices-c',
      visible: true,
      buttons: []
    });
    
    const buttons = panelDevices.get('buttons');
    if (buttons) {
      buttons.add([
        {
          id: 'save-project',
          command: () => getProjectData(),
          className: 'fa fa-floppy-o',
          attributes: { title: 'Save Project' }
        },
        // Add load button
        {
          id: 'load-project',
          command: () => loadProjectData(),
          className: 'fa fa-upload',
          attributes: { title: 'Load Project' }
        },
        // Add preview button
        {
          id: 'preview-static',
          command: () => previewStatic(),
          className: 'fa fa-eye',
          attributes: { title: 'Preview' }
        }
      ]);
    }

  }, []);

  const getProjectData = async () => {
    try {
      if (!editor.current) return;
      
      // Get all project data
      const projectData = editor.current.getProjectData();
      
      // Extract HTML and CSS separately for easier rendering in preview
      const html = editor.current.getHtml();
      const css = editor.current.getCss();
      
      // Create enhanced data object with both project data and extracted HTML/CSS
      const enhancedData = {
        ...projectData,
        html,
        css
      };
      
      await axios.post("/api", {
        data: enhancedData,
      });
      alert('Template saved successfully!');
    } catch (error) {
      console.log(error);
    }
  };

  const loadProjectData = async () => {
    try {
      if (!editor.current) return;
      const response = await axios.get("/api");
      const data = response.data;
      editor.current.loadProjectData(data);
      alert('Template loaded successfully!');
    } catch (error) {
      console.error("Error loading project:", error);
      alert('Failed to load template.');
    }
  };

  const previewStatic = () => {
    window.open('/static', '_blank');
  };

  return (
    <div className="GrapesjsApp h-screen w-screen flex flex-col overflow-hidden">
      <div className="Editor-content flex-grow overflow-hidden relative">
        <div id="gjs" className="!h-full w-full absolute inset-0" />
      </div>
    </div>
  );
};

export default Editor;
