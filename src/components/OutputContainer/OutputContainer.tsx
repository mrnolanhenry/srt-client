import './OutputContainer.css';
import { useState } from 'react';
import CopyTextArea from '../common/CopyTextArea/CopyTextArea';
import TabbedContainer from '../common/TabbedContainer/TabbedContainer';
import TabWrapper from '../common/TabWrapper/TabWrapper';
import { DOWNLOAD_CHAR } from '../../constants/constants';
import FileDownload from '../FileDownload/FileDownload';

interface OutputContainerProps {
    downloadFileName: string;
    scrollRef: React.RefObject<HTMLTextAreaElement>;
    textOutput: string;
    handleScroll: (event: any) => void;
    handleTextOutputChange: (event: any) => void;
}

const OutputContainer = ({ downloadFileName, scrollRef, textOutput, handleScroll, handleTextOutputChange }: OutputContainerProps) => {
    const OUTPUT_SUBTITLES = "outputSubtitles";
    const DOWNLOAD_SUBTITLES = "downloadSubtitles";

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
            <TabWrapper
                containerClassNames={`padded-container`}
                containerId={DOWNLOAD_SUBTITLES}
                containerTitle="Download">
                <div className="flex-row padded-row centered-row">
                    <div className="flex-column">
                        <FileDownload
                            buttonId={"btnDownload"}
                            defaultFileName={downloadFileName}
                            label={`Download ${DOWNLOAD_CHAR}`}
                            textOutput={textOutput}
                        />
                    </div>
                </div>
            </TabWrapper>
        </TabbedContainer>
    );
};

export default OutputContainer;
