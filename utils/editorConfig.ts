import gjsForms from "grapesjs-plugin-forms";
import gjsPresetWebpage from "grapesjs-preset-webpage";
import grapesjsBlocksBasic from "grapesjs-blocks-basic";
import grapesjsPluginExport from "grapesjs-plugin-export";
import grapesjsTuiImageEditor from "grapesjs-tui-image-editor";
import grapesjsNavbar from "grapesjs-navbar";
import grapesjsComponentCountdown from "grapesjs-component-countdown";
import grapesjsStyleGradient from "grapesjs-style-gradient";
import grapesjsStyleFilter from "grapesjs-style-filter";
import grapesjsStyleBg from "grapesjs-style-bg";
import grapesjsBlocksFlexbox from "grapesjs-blocks-flexbox";
import grapesjsTooltip from "grapesjs-tooltip";
import grapesjsCustomCode from "grapesjs-custom-code";
import grapesjsTyped from "grapesjs-typed";
import grapesjsTailwindcss from "grapesjs-tailwindcss-plugin";
import columnSystem from "@/plugins/columnSystem";
import parserPostCSS from "grapesjs-parser-postcss";
import grapesjsGoogleMaterialIcons from "grapesjs-google-material-icons";
import grapesjsTailwind from "grapesjs-tailwind";
import grapesjsFilterStyles from "@silexlabs/grapesjs-filter-styles";

export const getEditorConfig = () => {
  return {
    container: "#gjs",
    fromElement: false,
    storageManager: false,
    plugins: [
      grapesjsBlocksBasic,
      gjsPresetWebpage,
      gjsForms,
      columnSystem,
      grapesjsPluginExport,
      grapesjsTuiImageEditor,
      grapesjsNavbar,
      grapesjsComponentCountdown,
      grapesjsStyleGradient,
      grapesjsStyleFilter,
      grapesjsStyleBg,
      grapesjsBlocksFlexbox,
      grapesjsTooltip,
      grapesjsCustomCode,
      grapesjsTyped,
      parserPostCSS,
      grapesjsTailwindcss,
      grapesjsGoogleMaterialIcons,
      grapesjsTailwind,
      grapesjsFilterStyles,
    ],
    pluginsOpts: {
      columnSystem: {
        category: "Layout",
        flexLabel: "Flex Row",
        gridLabel: "Grid Row",
      },
      "grapesjs-tailwindcss-plugin": {
        autobuild: true, // Automatically rebuild Tailwind CSS on each update
        buildButton: true, // Add a manual build button to the toolbar
        toolbarPanel: "options",
      },
      "grapesjs-google-material-icons": {
        // You can add custom options here if needed
      },
      "grapesjs-tailwind": {
        // You can add custom options here if needed
      },
      "@silexlabs/grapesjs-filter-styles": {
        /* options */
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
            "direction",
          ],
          properties: [
            {
              name: "Font Family",
              property: "font-family",
              type: "select",
              defaults: "Arial, Helvetica, sans-serif",
              list: [
                { value: "Arial, Helvetica, sans-serif", name: "Arial" },
                { value: "Georgia, serif", name: "Georgia" },
                { value: "Tahoma, Geneva, sans-serif", name: "Tahoma" },
                {
                  value: "Times New Roman, Times, serif",
                  name: "Times New Roman",
                },
                { value: "Verdana, Geneva, sans-serif", name: "Verdana" },
                { value: "var(--font-iran-sans)", name: "Iran Sans" },
                {
                  value: "var(--font-iran-yekan-medium)",
                  name: "Iran Yekan Medium",
                },
                { value: "var(--font-geist-sans)", name: "Geist Sans" },
              ],
            },
            {
              name: "Direction",
              property: "direction",
              type: "select",
              defaults: "ltr",
              list: [
                { value: "ltr", name: "Left to Right (LTR)" },
                { value: "rtl", name: "Right to Left (RTL)" },
              ],
            },
          ],
        },
        {
          name: "Decorations",
          open: false,
          buildProps: [
            "background-color",
            "background-image",
            "background-repeat",
            "background-position",
            "background-size",
            "border",
            "border-radius",
            "box-shadow",
          ],
          properties: [
            {
              name: "Background Image",
              property: "background-image",
              type: "file",
              functionName: "url",
            },
            {
              name: "Background Size",
              property: "background-size",
              type: "select",
              defaults: "auto",
              list: [
                { value: "auto", name: "Auto" },
                { value: "cover", name: "Cover" },
                { value: "contain", name: "Contain" },
              ],
            },
            {
              name: "Background Position",
              property: "background-position",
              type: "select",
              defaults: "center center",
              list: [
                { value: "center center", name: "Center" },
                { value: "left top", name: "Left Top" },
                { value: "left center", name: "Left Center" },
                { value: "left bottom", name: "Left Bottom" },
                { value: "right top", name: "Right Top" },
                { value: "right center", name: "Right Center" },
                { value: "right bottom", name: "Right Bottom" },
                { value: "center top", name: "Center Top" },
                { value: "center bottom", name: "Center Bottom" },
              ],
            },
            {
              name: "Background Repeat",
              property: "background-repeat",
              type: "select",
              defaults: "no-repeat",
              list: [
                { value: "no-repeat", name: "No-repeat" },
                { value: "repeat", name: "Repeat" },
                { value: "repeat-x", name: "Repeat-x" },
                { value: "repeat-y", name: "Repeat-y" },
              ],
            },
          ],
        },
        {
          name: "Image",
          open: false,
          buildProps: [
            "width",
            "height",
            "aspect-ratio",
            "object-fit",
            "object-position",
            "filter",
          ],
          properties: [
            {
              name: "Object Fit",
              property: "object-fit",
              type: "select",
              defaults: "fill",
              list: [
                { value: "fill", name: "Fill" },
                { value: "contain", name: "Contain" },
                { value: "cover", name: "Cover" },
                { value: "none", name: "None" },
                { value: "scale-down", name: "Scale Down" },
              ],
            },
            {
              name: "Object Position",
              property: "object-position",
              type: "text",
              defaults: "50% 50%",
            },
            {
              name: "Aspect Ratio",
              property: "aspect-ratio",
              type: "text",
              defaults: "",
            },
            {
              name: "Filter",
              property: "filter",
              type: "text",
              defaults: "",
            },
          ],
        },
        {
          name: "Overflow & Visibility",
          open: false,
          buildProps: ["overflow", "overflow-x", "overflow-y"],
          properties: [
            {
              name: "Overflow",
              property: "overflow",
              type: "select",
              defaults: "visible",
              list: [
                { value: "visible", name: "Visible" },
                { value: "hidden", name: "Hidden" },
                { value: "scroll", name: "Scroll" },
                { value: "auto", name: "Auto" },
                { value: "clip", name: "Clip" },
              ],
            },
            {
              name: "Overflow X",
              property: "overflow-x",
              type: "select",
              defaults: "visible",
              list: [
                { value: "visible", name: "Visible" },
                { value: "hidden", name: "Hidden" },
                { value: "scroll", name: "Scroll" },
                { value: "auto", name: "Auto" },
                { value: "clip", name: "Clip" },
              ],
            },
            {
              name: "Overflow Y",
              property: "overflow-y",
              type: "select",
              defaults: "visible",
              list: [
                { value: "visible", name: "Visible" },
                { value: "hidden", name: "Hidden" },
                { value: "scroll", name: "Scroll" },
                { value: "auto", name: "Auto" },
                { value: "clip", name: "Clip" },
              ],
            },
          ],
        },
      ],
    },
    canvas: {
      styles: ["http://localhost:3000/custom.css"],
    },
  };
};
