import { ReactElement } from 'react';

type TToolbarButtonProps = {
  label?: string,
  icon?: string | ReactElement,
  action: () => void,
  active?: boolean
}

export function ToolbarButton({ label, icon, action, active }: TToolbarButtonProps) {
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
    <div className={`toolbar-button ${active ? 'active' : null}`} onClick={action}>
      {renderButtonIcon()}
      {renderButtonLabel()}
    </div>
  );
}