import React, { useState } from "react";
import JoditEditor from "jodit-react";
const confiq = {
  buttons: [
    "bold",
    "Italic",
    "underline",
    "link",
    "unlink",
    "source",
    "ul",
    "ol",
    "fontsize",
    "hr",
  ],
};

const TextEditor = ({ editorRef, value }) => {
  const [content, setContent] = useState(value || "");

  return (
    <div>
      <JoditEditor
        ref={editorRef}
        value={content}
        config={confiq}
        tabIndex={1}
        onBlur={(newContent) => setContent(newContent)}
      />
    </div>
  );
};

export default TextEditor;
