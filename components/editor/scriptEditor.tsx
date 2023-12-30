import { useEffect, useRef, useState } from 'react';
import { Editor } from './editor';
import { EditorToolbar } from '../toolbar/editorToolbar';
import useUser from '../../lib/useUser';

export const ScriptEditor = () => {
  const { user } = useUser();
  const [editor, setEditor ] = useState<Editor>(new Editor());
  const SCRIPT_REF = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editor.loaded && SCRIPT_REF.current) {
      editor.init(SCRIPT_REF.current);
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
      <div className={'editor'} ref={SCRIPT_REF}/>
    </div>
  );
};

