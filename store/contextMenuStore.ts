import { makeAutoObservable } from 'mobx';
import { ReactElement } from "react";

type CtxMenuOption = {
  id: string,
  label?: string,
  icon?: ReactElement,
  onClick?: () => void,
}

type SetupProps = {
  id: string,
  hidden: boolean,
  position?: { x: number, y: number },
  target: HTMLElement,
  options: CtxMenuOption[],
}

function parsePosition(target: HTMLElement) {
  let position = { x: 0, y: 0 };
  const BB = target.getBoundingClientRect();

  if (BB.x + 200 > window.innerWidth) {
    position.x = window.innerWidth - 230;
  } else {
    position.x = BB.x;
  }

  position.y = BB.y + 30;

  return position;
}

export class ContextMenuStore {
  id: string | null = null;
  hidden: boolean = true;
  position: { x: number, y: number } = { x: 0, y: 0 };
  options: CtxMenuOption[] = [];
  target: HTMLElement | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setup = (props: SetupProps) => {
    if (props.id === this.id) {
      this.destroy();
    } else {
      let position;
      if (props.position) {
        position = props.position;
      } else {
        position = parsePosition(props.target);
      }
      this.setId(props.id);
      this.setTarget(props.target);
      this.setOptions(props.options);
      this.setHidden(props.hidden);
      this.setPosition(position);
    }
  };

  setId = (id: string | null) => {
    this.id = id;
  };

  setTarget = (target: HTMLElement | null) => {
    this.target = target;
  }

  setOptions = (options: CtxMenuOption[]) => {
    this.options = options;
  };

  setHidden = (hidden: boolean) => {
    this.hidden = hidden;
  };

  setPosition = (position: { x: number, y: number }) => {
    this.position = position;
  };

  reposition = () => {
    if (this.target) {
      this.position = parsePosition(this.target);
    }
  }

  destroy = () => {
    this.setHidden(true);
    this.setId(null);
    this.setTarget(null);
  }
}