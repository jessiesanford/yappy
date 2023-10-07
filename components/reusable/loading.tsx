import styled, { keyframes } from 'styled-components';

const keyFrames = keyframes`
  0% {
    transform: rotate(0);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  50% {
    transform: rotate(900deg);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  100% {
    transform: rotate(1800deg);
  }
`;

export const LoadingSpinner = styled.div`
  display: inline-block;
  position: relative;
  width: ${props => props.containerSize || '80px'}; /* Use the provided width or default to '80px' */
  height: ${props => props.containerSize || '80px'}; /* Use the provided height or default to '80px' */

  &:after {
    content: " ";
    display: block;
    border-radius: 50%;
    width: 0;
    height: 0;
    box-sizing: border-box;
    border: ${props => props.spinnerSize || '16px'} solid #fff;
    border-color: ${props => props.color || '#fff'} transparent ${props => props.color || '#fff'} transparent;
    animation: ${keyFrames} 1.2s infinite;
  }
`;

export const LoadingSpinner2 = ({ size, color }: { size: string, color: string }) => {
  const rotation = keyframes`
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  `;

  const Component = styled.div`
    width: ${() => size || '48px'};
    height: ${() => size || '48px'};
    border: 2px solid ${() => color || '#ffffff'};
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: ${rotation} 1s linear infinite;
  `;

  return (
    <div>
      <Component />
    </div>
  );
}