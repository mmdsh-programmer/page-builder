/**
 * GrapesJS Editor Configuration
 * Contains the default configuration for the GrapesJS editor
 */
import gjsForms from "grapesjs-plugin-forms";
import gjsPresetWebpage from "grapesjs-preset-webpage";
import grapesjsBlocksBasic from "grapesjs-blocks-basic";
import columnSystem from "../../../plugins/columnSystem";

export const getEditorConfig = () => {
  return {
    container: "#gjs",
    fromElement: false,
    storageManager: {
      type: "none", 
      autosave: false,
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
        category: "Layout",
        flexLabel: "Flex Row",
        gridLabel: "Grid Row",
      },
    },
    // Configure asset manager
    assetManager: {
      assets: [],
      dropzone: true,
      upload: "/api/upload-asset",
    },
    // Configure style manager with common properties
    styleManager: {
      sectors: [
        {
          name: "Dimension",
          open: false,
          buildProps: [
            "width",
            "height",
            "min-width",
            "min-height",
            "max-width",
            "max-height",
            "padding",
            "margin",
          ],
        },
        {
          name: "Typography",
          open: false,
          buildProps: [
            "font-family",
            "font-size",
            "font-weight",
            "letter-spacing",
            "color",
            "line-height",
            "text-align",
            "text-decoration",
            "text-shadow",
          ],
        },
        {
          name: "Decorations",
          open: false,
          buildProps: [
            "background-color",
            "border",
            "border-radius",
            "box-shadow",
          ],
        },
      ],
    },
    canvas: {
      styles: [
        "http://localhost:3000/swiper-bundle.min.css",
        "http://localhost:3000/custom.css",
      ],
      scripts: ["http://localhost:3000/swiper-bundle.min.js"],
    },
  };
}; 