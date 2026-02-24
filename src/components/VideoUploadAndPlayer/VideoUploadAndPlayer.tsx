import React, { useState, useRef, useEffect } from 'react';
import './VideoUploadAndPlayer.css';
import { ARROW_LEFT_CHAR, ARROW_RIGHT_CHAR, NUDGE_LEFT_CHAR, NUDGE_RIGHT_CHAR, SPEECH_BUBBLES_CHAR, UPLOAD_CHAR } from '../../constants/constants';
import VideoControlButton from '../VideoControlButton/VideoControlButton';
import useDebounce from '../../hooks/useDebounce';
import fullscreenIcon from '../../assets/fullscreen.png';
import fullscreenExitIcon from '../../assets/fullscreen_exit.png';
import SubtitleUtils from '../../utilities/SubtitleUtils';


interface VideoUploadAndPlayerProps {
  cues: VTTCue[];
  textOutput: string;
  timeInput: Date;
  videoRef: React.RefObject<HTMLVideoElement>;
  handleFixSubtitles: (cues: VTTCue[]) => void;
}

const VideoUploadAndPlayer = ({cues, textOutput, timeInput, videoRef, handleFixSubtitles}: VideoUploadAndPlayerProps) => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isNewUpload, setIsNewUpload] = useState(false);
  const [isControlFocused, setIsControlFocused] = useState(false);
  const [isVideoFocused, setIsVideoFocused] = useState(false);
  const [shouldHideControls, setShouldHideControls] = useState(false);
  const [shouldDisableControls, setShouldDisableControls] = useState(true);
  const debouncedShouldHideControls = useDebounce(shouldHideControls, 200);

  const getTimeInputInSeconds = () => {
    return (timeInput.getSeconds() * 1000 + timeInput.getMilliseconds()) / 1000;
  }

  const [defaultTime, setDefaultTime] = useState<number>(getTimeInputInSeconds());


  useEffect(() => {
    setDefaultTime(getTimeInputInSeconds())
  }, [timeInput]);

  const label = `Upload Video ${UPLOAD_CHAR}`;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && videoWrapperRef.current) {
      // Request fullscreen on the wrapper element
      videoWrapperRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      // Exit fullscreen
      setIsFullscreen(false);
      document.exitFullscreen();
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Create a Blob URL for the uploaded file
      const objectUrl = URL.createObjectURL(file);
      setIsNewUpload(true);
      setVideoSrc(objectUrl);

      // Clean up the previous object URL if it exists
      if (videoSrc) {
        URL.revokeObjectURL(videoSrc);
      }
    }
  };

  // Optional: Clean up the object URL when the component unmounts
  useEffect(() => {
    return () => {
      if (videoSrc) {
        URL.revokeObjectURL(videoSrc);
      }
    };
  }, [videoSrc]);

  // enable custom controls on video player when video has a src, disable otherwise.
  useEffect(() => {
      if (videoSrc) {
        setShouldDisableControls(false);
      }
      else {
        setShouldDisableControls(true);
      }
  }, [videoSrc]);

  // hide custom controls on video player when video is playing and not focused, similar to OOTB controls
  // and when our custom controls themselves are not focused
  useEffect(() => {
    setShouldHideControls(!isControlFocused && !isVideoFocused && videoRef.current && !videoRef.current.paused);
  }, [videoRef.current && videoRef.current.paused, isVideoFocused]);

  // Whenever cues change (e.g. when new subtitles are fixed), we want to reset the text tracks on the video element to reflect the new cues
  useEffect(() => {
    resetVideoTextTracks();
  }, [cues]);

  // Whenever a new video is uploaded (and able to play through), we want to reset the text tracks on the video element to reflect our cues 
  const handleCanPlayThrough = () => {
    if (isNewUpload) {
      resetVideoTextTracks();
    }
    setIsNewUpload(false);
  };

  const goToPreviousCue = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const previousCue = cues.findLast((cue: VTTCue) => cue.startTime < currentTime);
      if (previousCue) {
        videoRef.current.currentTime = previousCue.startTime;
        videoRef.current.focus();
      }
      else {
        console.log('No previous subtitle found');
      }
    }
  };

  const goToNextCue = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const nextCue = cues.find(cue => cue.startTime > currentTime);
      if (nextCue) {
        videoRef.current.currentTime = nextCue.startTime;
        videoRef.current.focus();
      }
      else {
        console.log('No next subtitle found');
      }
    }
  };

  const getCurrentCue = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      return cues.find(cue => cue.startTime <= currentTime && cue.endTime >= currentTime);
    }
    return null;
  };

  const resetVideoTextTracks = () => {
    if (videoRef.current) {
      const tracks = videoRef.current.textTracks;
      
      if (tracks.length === 0) {
        const newTrack = videoRef.current.addTextTrack("subtitles");
        // Set text track mode to "showing" to make subtitles visible by default
        newTrack.mode = "showing";
      }

      // Remove existing cues from all text tracks (theoretically, there should only be one)
      for (let i = 0; i < tracks.length; i++) {
        // Iterate over the cues and active cues and remove them
        const track = tracks[i];
        const oldCues = Array.from(track.cues || []);
        oldCues.forEach(cue => {
          track.removeCue(cue);
        });
        const oldActiveCues = Array.from(track.activeCues || []);
        oldActiveCues.forEach(cue => {
          track.removeCue(cue);
        });
      }

      cues.forEach(cue => {
        tracks[0].addCue(cue);
      });
      if (timeInput) {
        videoRef.current.currentTime = defaultTime;
      };
    }
  };

  const nudgeCuesBack = () => {
    handleNudge(-100);
  }

  const nudgeCuesForward = () => {
    handleNudge(100);
  }

  const handleNudge = (offsetInMilliseconds: number): void => {
    if (videoRef.current) {
      const lines = textOutput.split("\n");

      // Convert subtitle lines in text output to cues without altering timecodes or scrubbing non-dialogue
      let newCues: VTTCue[] = SubtitleUtils.convertLinesToCues(lines, false);
      const currentCue = getCurrentCue();

      if (currentCue) {
        // THEN perform time code adjustments on the VTTCue[] 
        newCues = SubtitleUtils.offsetCues(newCues, offsetInMilliseconds, Number(currentCue.id), null, false);

        // set a new defaultTime so the video will go to the start of the cue the user just nudged
        // after cues get reset.
        setDefaultTime(((currentCue.startTime * 1000) + offsetInMilliseconds) / 1000);

        handleFixSubtitles(newCues);
      }
      else {
        console.log("Error - could not find cue at current time:" + videoRef.current.currentTime);
      }
    }
  };

  return (
    <>
      <div id="videoRow" className="flex-row centered-row" ref={videoWrapperRef}>
        <video
          className={isFullscreen ? 'fullscreen' : ''}
          controls // Adds default browser controls (play, pause, etc.)
          controlsList="nofullscreen"
          height="370"
          ref={videoRef}
          src={videoSrc as string}
          width="640"
          onBlur={() => setIsVideoFocused(false)}
          onCanPlayThrough={handleCanPlayThrough}
          onFocus={() => setIsVideoFocused(true)}
          onMouseEnter={() => setIsVideoFocused(true)}
          onMouseLeave={() => setIsVideoFocused(false)}
        />
        <button className={`video-upload-button ${isFullscreen ? 'fullscreen' : ''} ${debouncedShouldHideControls ? 'hidden' : ''}`}
          onBlur={() => setIsControlFocused(false)}
          onFocus={() => setIsControlFocused(true)}
          onMouseEnter={() => setIsControlFocused(true)}
          onMouseLeave={() => setIsControlFocused(false)}>
          <input
            id="videoInput"
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            ref={fileInputRef}
          />
          <label htmlFor="videoInput" className="video-upload-label">
            {label}
          </label>
        </button>
        <div 
          id="videoControlsRow" 
          className={`flex-row spaced-between-row padded-row video-controls ${isFullscreen ? 'fullscreen' : ''} ${debouncedShouldHideControls ? 'hidden' : ''}`}
          onBlur={() => setIsControlFocused(false)}
          onFocus={() => setIsControlFocused(true)}
          onMouseEnter={() => setIsControlFocused(true)}
          onMouseLeave={() => setIsControlFocused(false)}>
            <div id="videoControlsColLeft" className="flex-column">
              <div id="videoControlsRowLeft" className="flex-row">
                <VideoControlButton
                  controlText={ARROW_LEFT_CHAR}
                  hoverText="Previous Subtitle"
                  isDisabled={shouldDisableControls}
                  handleClick={goToPreviousCue}
                />
                <VideoControlButton
                  controlText={SPEECH_BUBBLES_CHAR}
                  isClickable={false}
                  isDisabled={shouldDisableControls}
                />
                <VideoControlButton
                  controlText={ARROW_RIGHT_CHAR}
                  hoverText="Next Subtitle"
                  isDisabled={shouldDisableControls}
                  handleClick={goToNextCue}
                />
                <VideoControlButton
                  controlText={NUDGE_LEFT_CHAR}
                  hoverText="Nudge -100ms"
                  isDisabled={shouldDisableControls}
                  handleClick={nudgeCuesBack}
                />
                <VideoControlButton
                  controlText={NUDGE_RIGHT_CHAR}
                  hoverText="Nudge 100ms"
                  isDisabled={shouldDisableControls}
                  handleClick={nudgeCuesForward}
                />
              </div>
            </div>
            <div id="videoControlsColRight" className="flex-column">
              <div id="videoControlsRowRight" className="flex-row">
                <VideoControlButton
                  hoverText={`${isFullscreen ? "Exit" : "Enter"} Fullscreen`}
                  isDisabled={shouldDisableControls}
                  handleClick={toggleFullscreen}
                >
                  <img className="img-button" src={isFullscreen ? fullscreenExitIcon : fullscreenIcon} height={12} width={12} />
                </VideoControlButton>
              </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default VideoUploadAndPlayer;
