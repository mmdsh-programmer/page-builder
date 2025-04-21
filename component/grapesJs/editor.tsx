"use client";

import React, { useEffect, useRef } from "react";

import axios from "axios";
import gjsForms from "grapesjs-plugin-forms";
import gjsPresetWebpage from "grapesjs-preset-webpage";
import grapesjs, { Editor as GrapesEditor } from "grapesjs";
import grapesjsBlocksBasic from "grapesjs-blocks-basic";
import swiperComponent from "@/plugins/swiper";

const Editor = () => {
  const editor = useRef<GrapesEditor | null>(null);
  useEffect(() => {
    if (editor.current) return;
    editor.current = grapesjs.init({
      container: "#gjs",
      fromElement: false,
      storageManager: false,
      plugins: [grapesjsBlocksBasic, gjsPresetWebpage, gjsForms, swiperComponent],
      pluginsOpts: {
        swiperComponent:{}
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
        }
      ]);
    }

  }, []);

  const getProjectData = async () => {
    try {
      if (!editor.current) return;
      const data = editor.current.getProjectData();
      await axios.post("/api", {
        data,
      });
      alert('Template saved successfully!');
    } catch (error) {
      console.log(error);
    }
  };

  const loadProjectData = async () => {
    try {
      if (!editor.current) return;
      const result = await axios.get("/api");
      editor.current.loadProjectData(JSON.parse(result.data.data));
      alert('Template loaded successfully!');
    } catch (error) {
      console.log(error);
    }
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
