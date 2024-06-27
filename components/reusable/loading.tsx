import styled, { keyframes } from 'styled-components';

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
    width: ${(props) => size || '48px'};
    height: ${(props) => size || '48px'};
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