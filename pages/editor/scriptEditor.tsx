import { useEffect, useRef, useState } from 'react';
import { Editor } from './editor';
import { EditorToolbar } from '../../components/toolbar/editorToolbar';

export const ScriptEditor = () => {
  const [editor, setEditor ] = useState<Editor>(new Editor());

  useEffect(() => {
    if (!editor.loaded) {
      editor.init(SCRIPT_REF.current);
      setEditor(editor);
    }

    return () => {
      // editor.destroy();
    };
  }, []);

  const SCRIPT_REF = useRef(null);

  return (
    <div style={{ margin: 'auto', width: '80%' }}>
      <EditorToolbar/>
      <div className={'editor'} ref={SCRIPT_REF}/>
      <button onClick={() => editor.connect()}>Connect</button>
    </div>
  );
};

