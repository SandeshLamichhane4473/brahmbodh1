// components/RichTextEditor.js
import React, { useRef, useState } from 'react';
import JoditEditor from 'jodit-react';

const RichTextEditor = ({ value, onChange }) => {
  const editor = useRef(null);
  const [content, setContent] = useState(value || '');

  const config = {
    readonly: false,
    height: 400,
    toolbarSticky: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    uploader: { insertImageAsBase64URI: true },
  };

  return (
    <JoditEditor
      ref={editor}
      value={content}
      config={config}
      tabIndex={1}
      onBlur={newContent => {
        setContent(newContent);
        onChange && onChange(newContent);
      }}
    />
  );
};

export default RichTextEditor;
