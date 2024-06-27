import { useState, useEffect, useCallback } from 'react';
import Select, { SingleValue } from 'react-select';
import { FiBold, FiEdit, FiItalic, FiSave, FiUnderline } from 'react-icons/fi';
import { FaStrikethrough } from 'react-icons/fa';
import { toolbarScriptElementChanged } from '../editor/events/globalEvents';
import { EventTypes } from '../../static/enums';
import { ToolbarButtons } from '../editor/toolbar/toolbar';
import { Editor } from '../editor/editor';
import { ToolbarButton } from './editorToolbarButton';
import { darkSelectStyles } from '../../static/reactStyles';
import { makeDraggable } from '../../util/baseUtils';

export function EditorToolbar({ editor }: { editor: Editor }) {
  const [textElementType, setTextElementType] = useState('paragraph');
  const [textElementDisabled, setTextElementDisabled] = useState(false);
  const [boldActive, setBoldActive] = useState(false);
  const [italicsActive, setItalicsActive] = useState(false);
  const [underlineActive, setUnderlineActive] = useState(false);
  const [strikethroughActive, setStrikethroughActive] = useState(false);

  const scriptElementOptions = [
    { label: 'Paragraph', value: 'paragraph' },
    { label: 'Character', value: 'character' },
    { label: 'Dialogue', value: 'dialogue' },
  ];

  useEffect(() => {
    makeDraggable('.editor-container', '.toolbar-section', [
      '.navbar'
    ]);

    document.addEventListener(EventTypes.TEXT_MARK_TOGGLED, handleMarkToggled);
    document.addEventListener(EventTypes.TEXT_ELEMENT_UPDATED, handleElementChange);

    return () => {
      document.removeEventListener(EventTypes.TEXT_MARK_TOGGLED, handleMarkToggled);
      document.removeEventListener(EventTypes.TEXT_ELEMENT_UPDATED, handleElementChange);
    };
  }, []);

  const handleElementChange = useCallback((e: CustomEvent) => {
    const { element } = e.detail;
    setTextElementType(element);
    setTextElementDisabled(false);
  }, []);

  const handleMarkToggled = useCallback((e: CustomEvent) => {
    setBoldActive(e.detail.bold);
    setItalicsActive(e.detail.italics);
    setUnderlineActive(e.detail.underline);
    setStrikethroughActive(e.detail.strikethrough);
  }, []);

  function onScriptElementChange(data: SingleValue<{ label: string, value: string }>) {
    if (data) {
      toolbarScriptElementChanged(data.value);
    }
  }

  return (
    <div className={'editor-toolbar'}>
      <div className={'toolbar-section'}>
        <ToolbarButton icon={<FiBold/>}
                       action={() => editor.handleToolbarButtonClick(ToolbarButtons.BOLD)}
                       active={boldActive}
        />
        <ToolbarButton icon={<FiItalic/>}
                       action={() => editor.handleToolbarButtonClick(ToolbarButtons.ITALICS)}
                       active={italicsActive}
        />
        <ToolbarButton icon={<FiUnderline/>}
                       action={() => editor.handleToolbarButtonClick(ToolbarButtons.UNDERLINE)}
                       active={underlineActive}
        />
        <ToolbarButton icon={<FaStrikethrough/>}
                       action={() => editor.handleToolbarButtonClick(ToolbarButtons.STRIKETHROUGH)}
                       active={strikethroughActive}
        />
        <ToolbarButton icon={<FiSave/>}
                       action={() => editor.doSave()}
        />
      </div>
      <div className={'toolbar-section'} style={{ width: '200px' }}>
        <Select
          onChange={onScriptElementChange}
          options={scriptElementOptions}
          value={scriptElementOptions.find((el) => el.value === textElementType)}
          styles={darkSelectStyles}
          className={'toolbar-element-select'}
        />
      </div>
      <div className={'toolbar-section'} style={{ flex: 1, height: '100%' }}></div>
    </div>
  );
}