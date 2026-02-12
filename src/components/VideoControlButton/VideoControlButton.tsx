import './VideoControlButton.css';

interface VideoControlButtonProps {
    controlText: string;
    hoverText?: string;
    isClickable?: boolean;
    isDisabled: boolean;
    handleClick?: () => void;
}

const VideoControlButton = ({controlText, hoverText, isClickable, isDisabled, handleClick}: VideoControlButtonProps) => {
  const defaultClickable = true;
  isClickable = isClickable ?? defaultClickable;
    
  return (
    isClickable ? (
        <div className={`video-control-button-container ${isDisabled ? 'disabled' : ''}`}>
          <div className="video-control-span">
            {hoverText && (
            <small className="video-control-hover">
              {hoverText}
            </small>
            )}
            <button className={`video-control-button ${isDisabled ? 'disabled' : ''}`} onClick={handleClick}>
              <span className="video-control-character">{controlText}</span>
            </button>
          </div>
        </div>) : (
        <div className={`video-control-button-container ${isDisabled ? 'disabled' : ''}`}>
          <div className="video-control-span">
            <button className={`video-control-fake-button ${isDisabled ? 'disabled' : ''}`}>
              <span className="video-control-character">{controlText}</span>
            </button>
          </div>
        </div>
    )
  );
};

export default VideoControlButton;
