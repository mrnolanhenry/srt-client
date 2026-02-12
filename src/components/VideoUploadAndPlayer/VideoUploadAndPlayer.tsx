import React, { useState, useRef, useEffect } from 'react';
import './VideoUploadAndPlayer.css';

interface VideoUploadAndPlayerProps {
  cues: VTTCue[];
  videoRef: React.RefObject<HTMLVideoElement>;
  timeInput: Date;
}

const VideoUploadAndPlayer = ({cues, videoRef, timeInput}: VideoUploadAndPlayerProps) => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isNewUpload, setIsNewUpload] = useState(false);
  const label = "Upload Video";

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
          onCanPlayThrough={handleCanPlayThrough}
        />
      </div>
      <div id="videoUploadRow">
        <button>
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
      </div>
    </>
  );
};

export default VideoUploadAndPlayer;
