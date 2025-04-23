import { Component as GrapesJSComponent, Editor } from 'grapesjs';

/**
 * Apply custom CSS to a specific component
 */
export const applyComponentCSS = (component: GrapesJSComponent, css: string) => {
  if (!component || !css) return;

  const componentId = component.getId();
  let styleEl = document.getElementById(`custom-css-${componentId}`);

  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = `custom-css-${componentId}`;
    document.head.appendChild(styleEl);
  }

  try {
    // Create scoped CSS
    const scopedCss = css
      .replace(/\/\*[\s\S]*?\*\//g, "") // Remove comments
      .replace(
        /([^{]+)({[^}]*})/g,
        (match: string, selector: string, rules: string) => {
          const scopedSelector = selector
            .split(",")
            .map(
              (s: string) =>
                `#${componentId}${
                  s.trim().startsWith("&")
                    ? s.trim().substring(1)
                    : " " + s.trim()
                }`
            )
            .join(",");
          return `${scopedSelector}${rules}`;
        }
      );

    styleEl.innerHTML = scopedCss;
  } catch (e) {
    console.error("Error applying custom CSS:", e);
  }
};

/**
 * Set up custom CSS modal for components
 */
export const setupComponentCSSModal = (editor: Editor) => {
  const mdl = editor.Modal;
  const cmd = editor.Commands;
  let cssEditor: HTMLTextAreaElement | null = null;

  cmd.add("open-custom-css", {
    run(editor) {
      const selected = editor.getSelected();
      if (!selected) {
        mdl.open({
          title: "Custom CSS",
          content: "Please select a component first",
        });
        return;
      }

      // Get component custom CSS
      const customCSS = selected.get("custom-css") || "";

      mdl.open({
        title: "Custom CSS for " + selected.getName(),
        content: `
          <div style="margin-bottom: 10px; position: relative;">
            <textarea id="custom-css-editor"
              style="min-height: 250px; width: 100%; padding: 10px; font-family: monospace; resize: vertical;"
              placeholder="/* Custom CSS for this component */
              .my-class {
                color: red;
              }
            "
            >${customCSS}</textarea>
            <button id="apply-custom-css" style="margin-top: 10px; padding: 5px 10px; background: #4285f4; color: white; border: none; border-radius: 3px; cursor: pointer;">Apply CSS</button>
          </div>
        `,
      });

      cssEditor = document.getElementById(
        "custom-css-editor"
      ) as HTMLTextAreaElement;
      const applyBtn = document.getElementById("apply-custom-css");

      if (applyBtn) {
        applyBtn.onclick = () => {
          if (!cssEditor) return;
          const css = cssEditor.value;

          // Save CSS on the component
          selected.set("custom-css", css);

          // Apply the CSS
          applyComponentCSS(selected, css);
        };
      }
    },
  });

  // Apply custom CSS when components change
  editor.on("component:selected", (component: GrapesJSComponent) => {
    if (!component) return;

    const css = component.get("custom-css");
    if (css) {
      applyComponentCSS(component, css);
    }
  });
}; 