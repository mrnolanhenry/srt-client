import React, { useState, useRef, useEffect } from 'react';
import './VideoUploadAndPlayer.css';
import { ARROW_LEFT_CHAR, ARROW_RIGHT_CHAR, SPEECH_BUBBLES_CHAR, UPLOAD_CHAR } from '../../constants/constants';
import VideoControlButton from '../VideoControlButton/VideoControlButton';
import useDebounce from '../../hooks/useDebounce';

interface VideoUploadAndPlayerProps {
  cues: VTTCue[];
  videoRef: React.RefObject<HTMLVideoElement>;
  timeInput: Date;
}

const VideoUploadAndPlayer = ({cues, videoRef, timeInput}: VideoUploadAndPlayerProps) => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isNewUpload, setIsNewUpload] = useState(false);
  const [isControlFocused, setIsControlFocused] = useState(false);
  const [isVideoFocused, setIsVideoFocused] = useState(false);
  const [shouldHideControls, setShouldHideControls] = useState(false);
  const [shouldDisableControls, setShouldDisableControls] = useState(true);
  const debouncedShouldHideControls = useDebounce(shouldHideControls, 200);
  const label = `Upload Video ${UPLOAD_CHAR}`;

  const fileInputRef = useRef<HTMLInputElement>(null);

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
        const timeInputInSeconds = (timeInput.getSeconds() * 1000 + timeInput.getMilliseconds()) / 1000;
        videoRef.current.currentTime = timeInputInSeconds;
      };
    }
  };

  return (
    <>
      <div id="videoRow" className="flex-row centered-row">
        <video
          controls // Adds default browser controls (play, pause, etc.)
          height="385"
          ref={videoRef}
          src={videoSrc as string}
          width="670"
          onBlur={() => setIsVideoFocused(false)}
          onCanPlayThrough={handleCanPlayThrough}
          onFocus={() => setIsVideoFocused(true)}
          onMouseEnter={() => setIsVideoFocused(true)}
          onMouseLeave={() => setIsVideoFocused(false)}
        />
        <button className={`video-upload-button ${debouncedShouldHideControls ? 'hidden' : ''}`}
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
        <div id="videoControlsRow" className={`flex-row centered-row padded-row ${debouncedShouldHideControls ? 'hidden' : ''}`}
          onBlur={() => setIsControlFocused(false)}
          onFocus={() => setIsControlFocused(true)}
          onMouseEnter={() => setIsControlFocused(true)}
          onMouseLeave={() => setIsControlFocused(false)}>
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
        </div>
      </div>
    </>
  );
};

export default VideoUploadAndPlayer;
