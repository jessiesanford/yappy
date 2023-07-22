import { makeAutoObservable } from 'mobx';

type ctxSetupProps = {
  id: string,
  hidden: boolean,
  position?: { x: number, y: number },
  target: HTMLElement,
  options: [],
}

type ctxMenuOpt = {
  id: string,
  label: string,
  icon?: string,
  onClick: () => void,
}

export class ContextMenuStore {
  id: string | null = null;
  hidden: boolean = true;
  position: { x: number, y: number } = { x: 0, y: 0 };
  options: ctxMenuOpt[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setup = (props: ctxSetupProps) => {
    if (props.id === this.id) {
      this.destroy();
    } else {
      let position = { x: 0, y: 0 };
      if (props.position) {
        position = props.position;
      } else {
        const BB = props.target.getBoundingClientRect();
        if (BB.x + 200 > window.innerWidth) {
          position.x = window.innerWidth - 230;
        } else {
          position.x = BB.x;
        }
        position.y = BB.y + 30;
      }
      this.setId(props.id);
      this.setOptions(props.options);
      this.setHidden(props.hidden);
      this.setPosition(position);
    }
  };

  setId = (id: string | null) => {
    this.id = id;
  };

  setOptions = (options: []) => {
    this.options = options;
  };

  setHidden = (hidden: boolean) => {
    this.hidden = hidden;
  };

  setPosition = (position: { x: number, y: number }) => {
    this.position = position;
  };

  destroy = () => {
    this.setHidden(true);
    this.setId(null);
  }
}