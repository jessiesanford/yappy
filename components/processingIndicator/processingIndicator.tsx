import { useAppContext } from '../appProvider';
import { observer } from 'mobx-react-lite';

export const ProcessingIndicator = observer(() => {
  const {
    store
  } = useAppContext();

  const STUDIO_STORE = store.Studio;

  return (
    <div className={'processing-indicator'} style={{ display: STUDIO_STORE.processingStatus.hidden ? 'none' : 'initial' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div>{STUDIO_STORE.processingStatus.msg}</div>
        <div className="processing-dots">
          <span className="processing-dot dot-1">.</span>
          <span className="processing-dot dot-2">.</span>
          <span className="processing-dot dot-3">.</span>
        </div>
      </div>
    </div>
  );
});
