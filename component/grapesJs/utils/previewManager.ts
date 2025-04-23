import { Editor } from 'grapesjs';

/**
 * Open a preview of the current editor content in a new tab
 */
export const openPreviewInNewTab = () => {
  window.open("/static", "_blank");
};

/**
 * Generate full HTML preview with proper head/body structure
 */
export const generateFullPreview = (editor: Editor): string => {
  const html = editor.getHtml();
  const css = editor.getCss();
  const js = editor.getJs ? editor.getJs() : '';
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GrapesJS Preview</title>
  <style>
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    ${js}
  </script>
</body>
</html>
  `.trim();
};

/**
 * Create a data URL for previewing content in an iframe
 */
export const createPreviewDataUrl = (editor: Editor): string => {
  const fullPreview = generateFullPreview(editor);
  return `data:text/html;charset=utf-8,${encodeURIComponent(fullPreview)}`;
};

/**
 * Show preview in a modal within the editor
 */
export const showPreviewInModal = (editor: Editor) => {
  const modal = editor.Modal;
  const previewUrl = createPreviewDataUrl(editor);
  
  modal.open({
    title: 'Preview',
    content: `
      <div style="position: relative; height: 90vh; width: 100%;">
        <iframe 
          src="${previewUrl}"
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
        ></iframe>
      </div>
    `
  });
}; 