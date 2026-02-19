import './VideoContainer.css';
import { useRef, useState } from 'react';
import TabbedContainer from '../common/TabbedContainer/TabbedContainer';
import TabWrapper from '../common/TabWrapper/TabWrapper';
import VideoUploadAndPlayer from '../VideoUploadAndPlayer/VideoUploadAndPlayer';

interface VideoContainerProps {
    cues: VTTCue[];
    timeInput: Date;
}

const VideoContainer = ({ cues, timeInput }: VideoContainerProps) => {
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
                    timeInput={timeInput}
                    videoRef={videoRef as React.RefObject<HTMLVideoElement>}
                />
            </TabWrapper>
        </TabbedContainer>
    );
};

export default VideoContainer;
