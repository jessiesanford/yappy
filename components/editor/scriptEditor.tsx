import { useEffect, useRef, useState } from 'react';
import { Editor } from './editor';
import { EditorToolbar } from '../toolbar/editorToolbar';

export const ScriptEditor = () => {
  const [editor, setEditor ] = useState<Editor>(new Editor());

  useEffect(() => {
    if (!editor.loaded) {
      editor.init(SCRIPT_REF.current);
      setEditor(editor);
    }
  }, []);

  const SCRIPT_REF = useRef(null);

  return (
    <div className={'editor-container'}>
      <EditorToolbar editor={editor} />
      <div className={'editor'} ref={SCRIPT_REF}/>
    </div>
  );
};

