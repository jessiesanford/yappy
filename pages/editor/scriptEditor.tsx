import { useEffect, useRef } from 'react';
import { Editor } from './editor';

export const ScriptEditor = () => {

  useEffect(() => {
    const editor = new Editor();
    editor.init(SCRIPT_REF.current);

    return () => {
      editor.destroy();
    }
  }, []);

  const SCRIPT_REF = useRef(null);

  return (
    <div>
      <div className={'editor'} ref={SCRIPT_REF}/>
    </div>
  );
};