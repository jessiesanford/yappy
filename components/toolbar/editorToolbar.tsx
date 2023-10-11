import { FiBold, FiEdit, FiItalic, FiUnderline } from 'react-icons/fi';
import Select, { SingleValue } from 'react-select';

export function EditorToolbar() {
  const scriptElementOptions = [
    { label: 'Paragraph', value: 'paragraph' },
    { label: 'Character', value: 'character' },
    { label: 'Dialogue', value: 'Dialogue' },
  ];

  function onScriptElementChange(data: SingleValue<{ label: string, value: string }>) {
    console.log(data);
  }

  return (
    <div className={'editor-toolbar'}>
      <div className={'toolbar-section'}>
        <ToolbarButton icon={<FiBold/>} />
        <ToolbarButton icon={<FiItalic/>} />
        <ToolbarButton icon={<FiUnderline/>} />
      </div>
      <div className={'toolbar-section'}>
        <Select
          onChange={onScriptElementChange}
          options={scriptElementOptions}
        />
      </div>
    </div>
  );
}

export function ToolbarButton({ label, icon, action }) {
  function renderButtonIcon() {
    if (!icon) {
      return null;
    }

    return (
      <div className={'toolbar-button__icon'}>
        {icon}
      </div>
    );
  }

  function renderButtonLabel() {
    if (!label) {
      return null;
    }

    return (
      <div className={'toolbar-button__label'}>
        {icon}
      </div>
    );
  }

  return (
    <div className={'toolbar-button'} onClick={action}>
      {renderButtonIcon()}
      {renderButtonLabel()}
    </div>
  );
}