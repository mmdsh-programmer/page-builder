/**
 * Tailwind CSS Integration Utilities for GrapesJS
 * This file contains helper functions to integrate Tailwind CSS with GrapesJS editor
 */
import { Editor as GrapesEditor } from "grapesjs";

/**
 * Ensures that the Tailwind CSS styles are correctly applied in the editor
 * This function adds event listeners for page changes and frame renders
 * @param editor The GrapesJS editor instance
 */
export const setupTailwindIntegration = (editor: GrapesEditor) => {
  // Make sure the Tailwind styles are applied when a new page is rendered
  editor.on('canvas:frame:load', () => {
    // The TailwindCSS plugin will already handle most of the integration
    // This is just a helper to ensure everything works correctly
    editor.runCommand('build-tailwind');
  });

  // Force a Tailwind CSS build when changing pages (if using PageManager)
  if (editor.Pages) {
    editor.on('page:select', () => {
      // Ensure Tailwind CSS is rebuilt when switching pages
      editor.runCommand('build-tailwind');
    });
  }

  // Example of adding a manual rebuild button to a custom panel
  // Uncomment this if you need it
  /*
  const panelManager = editor.Panels;
  const customPanel = panelManager.addPanel({
    id: 'tailwind-tools',
    visible: true,
    buttons: [
      {
        id: 'rebuild-tailwind',
        className: 'fa fa-refresh',
        command: 'build-tailwind',
        attributes: { title: 'Rebuild Tailwind CSS' },
      }
    ],
  });
  */
}; 