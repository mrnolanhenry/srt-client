import './VideoContainer.css';
import { useRef, useState } from 'react';
import TabbedContainer from '../common/TabbedContainer/TabbedContainer';
import TabWrapper from '../common/TabWrapper/TabWrapper';
import VideoUploadAndPlayer from '../VideoUploadAndPlayer/VideoUploadAndPlayer';
import type { AppNotification } from '../../interfaces/AppNotification';

interface VideoContainerProps {
    cues: VTTCue[];
    textOutput: string;
    timeInput: Date;
    addNotifications: (notifications: AppNotification[]) => void;
    handleFixSubtitles: (cues: VTTCue[]) => void;
}

const VideoContainer = ({ cues, textOutput, timeInput, addNotifications, handleFixSubtitles }: VideoContainerProps) => {
    const VIDEO_PREVIEW = "videoPreview";

    const videoRef = useRef<HTMLVideoElement>(null);

    const [activeTab, setActiveTab] = useState<string>(VIDEO_PREVIEW);

    const handleActiveTab = (tabId: string) => {
        setActiveTab(tabId);
    }
    

    return (
        <TabbedContainer
            activeTab={activeTab}
            id="videoContainer"
            handleActiveTab={handleActiveTab}
        >
            <TabWrapper
                containerClassNames={`padded-container`}
                containerId={VIDEO_PREVIEW}
                containerTitle="Preview"
            >
                <VideoUploadAndPlayer
                    cues={cues}
                    textOutput={textOutput}
                    timeInput={timeInput}
                    videoRef={videoRef as React.RefObject<HTMLVideoElement>}
                    addNotifications={addNotifications}
                    handleFixSubtitles={handleFixSubtitles}
                />
            </TabWrapper>
        </TabbedContainer>
    );
};

export default VideoContainer;
