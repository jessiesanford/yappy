import { FiLoader } from 'react-icons/fi';
import { TextAlign } from '../../static';

export default function LoadingSplash() {
  const loadingSplashStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  };

  const loadingSplashContentStyle = {
    width: '200px', // You can adjust the width and height of the centered div as needed
    height: '100px',
    backgroundColor: '#ffffff', // You can change the background color of the centered div
    borderRadius: '10px', // Add rounded corners to the div if desired
    textAlign: TextAlign.Center,
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div className={'loading-splash'} style={loadingSplashStyle}>
      <div className={'loading-splash__content'} style={loadingSplashContentStyle}>
        <FiLoader size={50}/>
      </div>
    </div>
  );
}