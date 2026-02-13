import './OutputContainer.css';
import { useState } from 'react';
import CopyTextArea from '../CopyTextArea/CopyTextArea';
import TabbedContainer from '../TabbedContainer/TabbedContainer';
import TabWrapper from '../TabWrapper/TabWrapper';

interface OutputContainerProps {
    scrollRef: React.RefObject<HTMLTextAreaElement>;
    textOutput: string;
    handleScroll: (event: any) => void;
    handleTextOutputChange: (event: any) => void;
}

const OutputContainer = ({ scrollRef, textOutput, handleScroll, handleTextOutputChange }: OutputContainerProps) => {
    const OUTPUT_SUBTITLES = "outputSubtitles";

    const [activeTab, setActiveTab] = useState<string>(OUTPUT_SUBTITLES);

    const handleActiveTab = (tabId: string) => {
        setActiveTab(tabId);
    }

    return (
        <TabbedContainer
            activeTab={activeTab}
            id="outputContainer"
            handleActiveTab={handleActiveTab}
        >
            <TabWrapper
                containerClassNames={`padded-container`}
                containerId={OUTPUT_SUBTITLES}
                containerTitle="Fixed Subtitles"
            >
                <div className="flex-row">  
                    <CopyTextArea 
                        className="full-width no-resize" 
                        cols={50} 
                        id="srtOutput"
                        rows={23}
                        scrollRef={scrollRef}
                        onChange={handleTextOutputChange} 
                        onScroll={handleScroll}
                        value={textOutput}
                    />              
                </div>
            </TabWrapper>
        </TabbedContainer>
    );
};

export default OutputContainer;
