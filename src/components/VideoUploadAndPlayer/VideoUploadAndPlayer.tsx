import React, { useState, useRef, useEffect } from 'react';

interface VideoUploadAndPlayerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

const VideoUploadAndPlayer = ({videoRef, }: VideoUploadAndPlayerProps) => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Create a Blob URL for the uploaded file
      const objectUrl = URL.createObjectURL(file);
      console.log('file size: ' + Math.round(file.size / (1024 * 1024)) + ' MB');
      console.log("Setting video source - timestamp: ");
      console.log(new Date(Date.now()).toTimeString());
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

  const handleCanPlayThrough = () => {
    console.log('Video can play through - timestamp: ');
    console.log(new Date(Date.now()).toTimeString());

    console.log("videoRef");
    console.log(videoRef);
    console.log("videoRef.current");
    console.log(videoRef.current);

    if (videoRef.current) {
      const tracks = videoRef.current.textTracks;
      
      if (tracks.length === 0) {
        const newTrack = videoRef.current.addTextTrack("subtitles");
        // Set text track mode to "showing" to make subtitles visible by default
        newTrack.mode = "showing";
      }

      // Remove existing cues from all text tracks (theoretically, there should only be one)
      for (let i = 0; i < tracks.length; i++) {
        // Iterate over the active cues and remove them
        const track = tracks[i];
        const activeCues = track.activeCues;
        if (activeCues) {
          for (let j = 0; j < track.activeCues.length; j++) {
            track.removeCue(activeCues[j]);
          }
        }
      }

      const newCue = new VTTCue(1, 5, "This is a test subtitle.");
      tracks[0].addCue(newCue);
      const cue: VTTCue = ((tracks[0].cues as TextTrackCueList)[0] as VTTCue);
      console.log("cue.text");
      console.log(cue.text);
    }
  };

  return (
    <div>
      <span>Upload and Play Video</span>
      <input
        type="file"
        accept="video/*"
        onChange={handleVideoUpload}
        ref={fileInputRef}
      />
      {videoSrc && (
        <div style={{ marginTop: '20px' }}>
          <video
            controls // Adds default browser controls (play, pause, etc.)
            height="300"
            ref={videoRef}
            src={videoSrc}
            width="600"
            onCanPlayThrough={handleCanPlayThrough}
          />
        </div>
      )}
    </div>
  );
};

export default VideoUploadAndPlayer;
