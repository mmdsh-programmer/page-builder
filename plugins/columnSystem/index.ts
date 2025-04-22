import { ColumnSystemOptions } from '@/interface';
import { Editor, Plugin } from 'grapesjs';

/**
 * This plugin adds flex and grid based column systems to GrapesJS
 */
const columnSystem: Plugin<ColumnSystemOptions> = (editor: Editor, opts = {}) => {
  const options = {
    gridLabel: 'Grid Row',
    flexLabel: 'Flex Row',
    category: 'Layout',
    blockManager: true,
    blocks: {
      flexRow: true,
      gridRow: true,
    },
    styleManager: true,
    ...opts
  };

  // Load components
  loadComponents(editor);

  // Load blocks if enabled
  if (options.blockManager) {
    loadBlocks(editor, options);
  }

  // Add layout specific styles to style manager
  if (options.styleManager) {
    loadStyleManager(editor);
  }
};

/**
 * Add component types for flex and grid layouts
 */
function loadComponents(editor: Editor) {
  const domc = editor.DomComponents;

  // Flex container component
  domc.addType('flex-row', {
    isComponent: (el) => el.tagName === 'DIV' && el.classList.contains('flex-row'),
    model: {
      defaults: {
        tagName: 'div',
        name: 'Flex Row',
        droppable: true,
        draggable: true,
        highlightable: true,
        attributes: { class: 'flex-row' },
        style: {
          display: 'flex',
          'flex-wrap': 'wrap',
          width: '100%',
          padding: '10px',
        },
        'style-signature': ['display', 'flex-wrap', 'justify-content', 'align-items'],
        traits: [],
      }
    }
  });

  // Flex column component
  domc.addType('flex-column', {
    isComponent: (el) => el.tagName === 'DIV' && el.classList.contains('flex-column'),
    model: {
      defaults: {
        tagName: 'div',
        name: 'Flex Column',
        draggable: true,
        droppable: true,
        attributes: { class: 'flex-column' },
        style: {
          flex: '1 0 33.333%',
          padding: '10px',
          'box-sizing': 'border-box',
        },
        'style-signature': ['flex', 'padding', 'margin'],
        traits: [],
      }
    }
  });

  // Grid container component
  domc.addType('grid-row', {
    isComponent: (el) => el.tagName === 'DIV' && el.classList.contains('grid-row'),
    model: {
      defaults: {
        tagName: 'div',
        name: 'Grid Row',
        droppable: true,
        draggable: true,
        highlightable: true,
        attributes: { class: 'grid-row' },
        style: {
          display: 'grid',
          'grid-template-columns': 'repeat(3, 1fr)',
          'grid-gap': '10px',
          width: '100%',
          padding: '10px',
        },
        'style-signature': ['display', 'grid-template-columns', 'grid-gap'],
        traits: [],
      }
    }
  });

  // Grid cell component
  domc.addType('grid-cell', {
    isComponent: (el) => el.tagName === 'DIV' && el.classList.contains('grid-cell'),
    model: {
      defaults: {
        tagName: 'div',
        name: 'Grid Cell',
        draggable: true,
        droppable: true,
        attributes: { class: 'grid-cell' },
        style: {
          padding: '10px',
          'box-sizing': 'border-box',
        },
        'style-signature': ['padding', 'margin'],
        traits: [],
      }
    }
  });
}

/**
 * Add blocks for flex and grid layouts
 */
function loadBlocks(editor: Editor, options: ColumnSystemOptions) {
  const bm = editor.BlockManager;
  const category = options.category || 'Layout';

  // Add flex row block
  if (options.blocks?.flexRow) {
    bm.add('flex-row', {
      label: options.flexLabel || 'Flex Row',
      category,
      content: {
        type: 'flex-row',
        components: [
          { type: 'flex-column', components: 'Column 1' },
          { type: 'flex-column', components: 'Column 2' },
          { type: 'flex-column', components: 'Column 3' },
        ]
      },
      attributes: { class: 'gjs-fonts gjs-f-b3' }
    });
  }

  // Add grid row block
  if (options.blocks?.gridRow) {
    bm.add('grid-row', {
      label: options.gridLabel || 'Grid Row',
      category,
      content: {
        type: 'grid-row',
        components: [
          { type: 'grid-cell', components: 'Cell 1' },
          { type: 'grid-cell', components: 'Cell 2' },
          { type: 'grid-cell', components: 'Cell 3' },
        ]
      },
      attributes: { class: 'gjs-fonts gjs-f-b3' }
    });
  }
}

/**
 * Add layout styling options to style manager
 */
function loadStyleManager(editor: Editor) {
  const sm = editor.StyleManager;

  // Add layout sector
  sm.addSector('layout', {
    name: 'Layout',
    open: false,
    buildProps: [
      'display',
      'flex-direction',
      'flex-wrap',
      'justify-content',
      'align-items',
      'align-content',
      'grid-template-columns',
      'grid-auto-rows',
      'grid-gap',
    ],
    properties: [
      {
        name: 'Display',
        property: 'display',
        type: 'select',
        defaults: 'block',
        list: [
          { id: 'block', value: 'block', name: 'Block' },
          { id: 'inline', value: 'inline', name: 'Inline' },
          { id: 'flex', value: 'flex', name: 'Flex' },
          { id: 'grid', value: 'grid', name: 'Grid' },
        ]
      },
      {
        name: 'Flex Direction',
        property: 'flex-direction',
        type: 'select',
        defaults: 'row',
        list: [
          { id: 'row', value: 'row', name: 'Row' },
          { id: 'row-reverse', value: 'row-reverse', name: 'Row Reverse' },
          { id: 'column', value: 'column', name: 'Column' },
          { id: 'column-reverse', value: 'column-reverse', name: 'Column Reverse' },
        ]
      },
      {
        name: 'Justify Content',
        property: 'justify-content',
        type: 'select',
        defaults: 'flex-start',
        list: [
          { id: 'flex-start', value: 'flex-start', name: 'Start' },
          { id: 'flex-end', value: 'flex-end', name: 'End' },
          { id: 'center', value: 'center', name: 'Center' },
          { id: 'space-between', value: 'space-between', name: 'Space Between' },
          { id: 'space-around', value: 'space-around', name: 'Space Around' },
          { id: 'space-evenly', value: 'space-evenly', name: 'Space Evenly' },
        ]
      },
      {
        name: 'Align Items',
        property: 'align-items',
        type: 'select',
        defaults: 'stretch',
        list: [
          { id: 'flex-start', value: 'flex-start', name: 'Start' },
          { id: 'flex-end', value: 'flex-end', name: 'End' },
          { id: 'center', value: 'center', name: 'Center' },
          { id: 'stretch', value: 'stretch', name: 'Stretch' },
        ]
      },
      {
        name: 'Grid Columns',
        property: 'grid-template-columns',
        type: 'select',
        defaults: 'repeat(3, 1fr)',
        list: [
          { id: 'grid-2', value: 'repeat(2, 1fr)', name: '2 Columns' },
          { id: 'grid-3', value: 'repeat(3, 1fr)', name: '3 Columns' },
          { id: 'grid-4', value: 'repeat(4, 1fr)', name: '4 Columns' },
          { id: 'grid-6', value: 'repeat(6, 1fr)', name: '6 Columns' },
          { id: 'grid-12', value: 'repeat(12, 1fr)', name: '12 Columns' },
        ]
      },
      {
        name: 'Grid Gap',
        property: 'grid-gap',
        type: 'composite',
        properties: [
          { type: 'number', units: ['px', 'em', 'rem', '%'], default: '10px', property: 'gap' },
        ]
      }
    ]
  }, { at: 0 });
}

export default columnSystem; 