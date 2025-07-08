"use client";

import dynamic from "next/dynamic";


// Import Froala Editor's CSS
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";

// Dynamically import FroalaEditor to disable SSR
const FroalaEditor = dynamic(() => import("react-froala-wysiwyg"), { ssr: false });

interface EditorProps {
  onChange: (value: string) => void;
  value: string;
}

const Editor = ({ onChange, value }: EditorProps) => {
  return (
    <div className="bg-white">
      <FroalaEditor
        tag="textarea"    // Use the textarea element
        model={value}     // Bind the value to the editor
        onModelChange={onChange}   // Trigger change when value is modified
      />
    </div>
  );
};

export default Editor;
