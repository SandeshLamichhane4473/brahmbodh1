// import React, { useRef } from 'react';
// import JoditEditor from 'jodit-react';

// const RichTextEditor = ({ value, onChange }) => {
//   const editor = useRef(null);

//   const config = {
//     readonly: false,
//     height: 800,
//     toolbarSticky: false,
//     toolbarAdaptive: false,
//    buttons: [
//     'source', '|', 
//     'bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', '|',
//     'ul', 'ol', 'indent', 'outdent', '|',
//     'font', 'fontsize', 'brush', 'paragraph', 'classSpan', '|',
//     'lineHeight', 'align', '|',
//     'image', 'video', 'table', 'link', 'file', '|',
//     'cut', 'copy', 'paste', '|',
//     'undo', 'redo', '|',
//     'hr', 'eraser', 'selectall', 'find', '|',
//     'print', 'fullsize', 'preview', 'about'
//   ],
//     uploader: {
//       insertImageAsBase64URI: true
//     },
//       style: {
//     lineHeight: '1.8',  // optional fallback
//   },

//    events: {
//   afterInit: (editor) => {
//     // Line height
//     editor.editor.style.lineHeight = '1.8';

//     // Padding inside the editor content
//     editor.editor.style.padding = '12px';

//     // Optional: margin or border
//     editor.editor.style.border = '1px solid #ccc';
//     editor.editor.style.borderRadius = '8px';
//   }
// }
//   };

//   return (
    
//      <div style={{ width: '100%', maxWidth: '100%', overflowX: 'auto' }}>
//       <JoditEditor
//         ref={editor}
//         value={value}
//         config={config}
//         tabIndex={1}
//         onBlur={newContent => onChange(newContent)} // ✅ update on blur only
//         onChange={() => {}} // 🟡 empty to prevent typing lag/focus issues
//       />
//     </div>
//   );
// };

// export default RichTextEditor;
import React, { useRef } from 'react';
import JoditEditor from 'jodit-react';

const RichTextEditor = ({ value, onChange }) => {
  const editor = useRef(null);

  const config = {
    readonly: false,
    height: 800,
    toolbarSticky: false,
    toolbarAdaptive: false,
    buttons: [
      'source', '|', 
      'bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', '|',
      'ul', 'ol', 'indent', 'outdent', '|',
      'font', 'fontsize', 'brush', 'paragraph', 'classSpan', '|',
      'lineHeight', 'align', '|',
      'image', 'video', 'table', 'link', 'file', '|',
      'cut', 'copy', 'paste', '|',
      'undo', 'redo', '|',
      'hr', 'eraser', 'selectall', 'find', '|',
      'print', 'fullsize', 'preview', 'about'
    ],
    uploader: {
      insertImageAsBase64URI: true
    },

    defaultFont: "Noto Sans Devanagari",

    fontValues: {
      "Noto Sans Devanagari": "'Noto Sans Devanagari', sans-serif",
      "Noto Serif Devanagari": "'Noto Serif Devanagari', serif",
      "Mukta":                 "'Mukta', sans-serif",
      "Laila":                 "'Laila', serif",
      "Tiro Devanagari":       "'Tiro Devanagari Hindi', serif",
      "Arial":                 "Arial, sans-serif",
      "Times New Roman":       "'Times New Roman', serif",
      "Courier New":           "'Courier New', monospace",
    },

    extraCSS: `
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@300;400;500;600;700&family=Noto+Serif+Devanagari:wght@400;600;700&family=Mukta:wght@300;400;500;600;700&family=Laila:wght@400;600&family=Tiro+Devanagari+Hindi&display=swap');

      body {
        font-family: 'Noto Sans Devanagari', 'Mukta', sans-serif !important;
        font-size: 16px;
        line-height: 1.8;
        color: #1a1917;
      }
    `,

    style: {
      lineHeight: '1.8',
    },

    events: {
      afterInit: (editor) => {
        editor.editor.style.lineHeight  = '1.8';
        editor.editor.style.padding     = '12px';
        editor.editor.style.border      = '1px solid #ccc';
        editor.editor.style.borderRadius = '8px';
        editor.editor.style.fontFamily  = "'Noto Sans Devanagari', 'Mukta', sans-serif";
        editor.editor.style.fontSize    = "16px";
      }
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '100%', overflowX: 'auto' }}>
      <JoditEditor
        ref={editor}
        value={value}
        config={config}
        tabIndex={1}
        onBlur={newContent => onChange(newContent)}
        onChange={() => {}}
      />
    </div>
  );
};

export default RichTextEditor;