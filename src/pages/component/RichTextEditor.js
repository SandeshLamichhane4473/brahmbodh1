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
      style: {
    lineHeight: '1.8',  // optional fallback
  },

   events: {
  afterInit: (editor) => {
    // Line height
    editor.editor.style.lineHeight = '1.8';

    // Padding inside the editor content
    editor.editor.style.padding = '12px';

    // Optional: margin or border
    editor.editor.style.border = '1px solid #ccc';
    editor.editor.style.borderRadius = '8px';
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
        onBlur={newContent => onChange(newContent)} // ✅ update on blur only
        onChange={() => {}} // 🟡 empty to prevent typing lag/focus issues
      />
    </div>
  );
};

export default RichTextEditor;
