"use client";

import React, { useEffect, useRef } from "react";
import grapesjs, { Editor as GrapesEditor } from "grapesjs";
import { getEditorConfig } from "@/utils/editorConfig";
import { setupComponentCSSModal } from "@/utils/componentCssManager";
import { setupIframeScrolling } from "@/utils/iframeManager";
import { setupCustomComponents, setupCustomBlocks } from "@/utils/componentsManager";
import { setupEditorStyles } from "@/utils/cssManager";
import { openPreviewInNewTab, showPreviewInModal } from "@/utils/previewManager";
import { setupTailwindIntegration } from "@/utils/tailwindIntegration";
import { IframeAction, IframeMode } from "@/interface/enum";
import { compressData, safeDecompress } from "@/utils/compressionManager";

const Editor = () => {
  const editor = useRef<GrapesEditor | null>(null);
  const saveRef = useRef<boolean>(true);

  useEffect(() => {
    if (editor.current) return;

    editor.current = grapesjs.init(getEditorConfig());

    const currentEditor = editor.current;

    setupComponentCSSModal(currentEditor);
    setupIframeScrolling(currentEditor);
    setupCustomComponents(currentEditor);
    setupCustomBlocks(currentEditor);
    setupEditorStyles(currentEditor);
    setupTailwindIntegration(currentEditor);

    setTimeout(() => {
      currentEditor.runCommand('build-tailwind');
    }, 500);

    currentEditor.on('component:add component:remove component:update component:styleUpdate', () => {
      saveRef.current = false;
      window.parent.postMessage({ action: IframeAction.TRACK_CHANGE }, "*");
    });

    window.addEventListener("message", handleParentMessage, false);

    const panelDevices = currentEditor.Panels.addPanel({
      id: "devices-c",
      visible: true,
      buttons: [],
    });

    const buttons = panelDevices.get("buttons");
    if (buttons) {
      buttons.add([
        {
          id: "preview-static",
          command: () => handlePreview(),
          className: "fa fa-eye",
          attributes: { title: "Preview" },
        },
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

    return () => {
      window.removeEventListener("message", handleParentMessage);
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!saveRef.current) {
        event.preventDefault();
        event.returnValue = "sure to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const isParsableString = (text: string): boolean => {
    try {
      JSON.parse(text);
      return true;
    } catch {
      return false;
    }
  };

  const handleParentMessage = async (event: MessageEvent) => {
    if (!editor.current) return;
    const currentEditor = editor.current;

    const isParsable =
      typeof event.data === "string" && isParsableString(event.data);

    if (typeof event.data === "string" && !isParsable) {
      return;
    }

    const messageData = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
    const { action, key, value } = messageData;

    if (
      action === IframeMode.PREVIEW ||
      action === IframeMode.TEMPORARY_PREVIEW
    ) {
      currentEditor.select();
      const wrapper = currentEditor.getWrapper();
      wrapper?.set('selectable', false);
      wrapper?.set('hoverable', false);
      currentEditor.Panels.getPanels().forEach((panel: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        if (panel.id !== 'views') {
          panel.set('visible', false);
        }
      });
    } else if (action === IframeMode.EDIT) {
      const wrapper = currentEditor.getWrapper();
      wrapper?.set('selectable', true);
      wrapper?.set('hoverable', true);
      currentEditor.Panels.getPanels().forEach((panel: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        panel.set('visible', true);
      });
    } else if (action === IframeAction.GET_DATA) {
      saveRef.current = true;
      const projectData = currentEditor.getProjectData();
      const htmlContent = currentEditor.getHtml();
      const cssContent = currentEditor.getCss();

      const dataToCompress = {
        projectData,
        html: htmlContent,
        css: cssContent
      };

      const compressedData = compressData(dataToCompress);

      if (event.source) {
        (event.source as Window).postMessage(
          { action, key, value: compressedData },
          "*"
        );
      }

      if (
        typeof window !== "undefined" &&
        (window as any).flutter_inappwebview // eslint-disable-line @typescript-eslint/no-explicit-any
      ) {
        (window as any).flutter_inappwebview?.callHandler( // eslint-disable-line @typescript-eslint/no-explicit-any
          "flutter_handler",
          { action, key, value: { content: compressedData } }
        );
      }
    } else if (action === IframeAction.SET_DATA) {
      if (value?.content) {
        try {
          const decompressedData = safeDecompress(value.content);

          if (typeof decompressedData === 'object' && decompressedData && 'projectData' in decompressedData) {
            currentEditor.loadProjectData((decompressedData as { projectData: any }).projectData); // eslint-disable-line @typescript-eslint/no-explicit-any
          }
          setTimeout(() => {
            currentEditor.runCommand('build-tailwind');
          }, 500);
        } catch (error) {
          console.error("Error parsing project data:", error);
        }
      }
    } else if (action === IframeAction.LOAD) {
      if (value?.content) {
        try {
          const decompressedData = safeDecompress(value.content);

          if (typeof decompressedData === 'object' && decompressedData && 'projectData' in decompressedData) {
            currentEditor.loadProjectData((decompressedData as { projectData: any }).projectData); // eslint-disable-line @typescript-eslint/no-explicit-any
          }
          setTimeout(() => {
            currentEditor.runCommand('build-tailwind');
          }, 500);
        } catch (error) {
          console.error("Error parsing project data:", error);
        }
      }
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
      </div>
    </div>
  );
};

export default Editor;
