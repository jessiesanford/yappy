import { useEffect, useRef, useState } from 'react';
import { Editor } from './editor';
import { EditorToolbar } from '../toolbar/editorToolbar';
import useUser from '../../lib/useUser';

export const ScriptEditor = () => {
  const { user } = useUser();
  const [editor, setEditor ] = useState<Editor>(new Editor());
  const scriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editor.loaded && scriptRef.current) {
      editor.init(scriptRef.current);
      setEditor(editor);
    }
  }, []);

  useEffect(() => {
    if (user && editor) {
      editor.setPresenceLabel(user.name || '');
    }
  }, [user]);


  return (
    <div className={'editor-container'}>
      <EditorToolbar editor={editor} />
      <div className={'editor'} ref={scriptRef}/>
    </div>
  );
};

