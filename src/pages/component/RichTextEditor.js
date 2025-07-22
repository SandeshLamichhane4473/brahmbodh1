import React, { useRef } from 'react';
import JoditEditor from 'jodit-react';

const RichTextEditor = ({ value, onChange }) => {
  const editor = useRef(null);

  const config = {
    readonly: false,
    height: 400,
    toolbarSticky: false,
    toolbarAdaptive: false,
    buttons: [
      'source', '|', 'bold', 'italic', 'underline', '|', 'ul', 'ol',
      '|', 'outdent', 'indent', '|', 'font', 'fontsize', 'brush', 'paragraph',
      '|', 'image', 'video', 'table', 'link', '|', 'align', 'undo', 'redo', '|', 'hr', 'eraser'
    ],
    uploader: {
      insertImageAsBase64URI: true
    }
  };

  return (
    <div>
      <h2>Jodit Rich Text Editor</h2>
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
