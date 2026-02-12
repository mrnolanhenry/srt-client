import './VideoControlButton.css';

interface VideoControlButtonProps {
    controlText: string;
    hoverText?: string;
    isClickable?: boolean;
    handleClick?: () => void;
}

const VideoControlButton = ({controlText, hoverText, isClickable, handleClick}: VideoControlButtonProps) => {
    const defaultClickable = true;
    isClickable = isClickable ?? defaultClickable;
    
  return (
    isClickable ? (
        <div className="video-control-button-container">
          <div className="video-control-span">
            {hoverText && (
            <small className="video-control-hover">
              {hoverText}
            </small>
            )}
            <div className="video-control-button" onClick={handleClick}>
              <span className="video-control-character">{controlText}</span>
            </div>
          </div>
        </div>) : (
        <div className="video-control-span">
          <div className="video-control-fake-button">
            <span className="video-control-character">{controlText}</span>
          </div>
        </div>
    )
  );
};

export default VideoControlButton;
