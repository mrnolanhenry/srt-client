import './OutputContainer.css';
import { useState } from 'react';
import CopyTextArea from '../CopyTextArea/CopyTextArea';
import TabbedContainer from '../TabbedContainer/TabbedContainer';
import TabWrapper from '../TabWrapper/TabWrapper';
import type { FileContent } from '../../interfaces/FileContent';
import { DOWNLOAD_CHAR } from '../../constants/constants';

interface OutputContainerProps {
    scrollRef: React.RefObject<HTMLTextAreaElement>;
    textOutput: string;
    handleScroll: (event: any) => void;
    handleTextOutputChange: (event: any) => void;
}

const OutputContainer = ({ scrollRef, textOutput, handleScroll, handleTextOutputChange }: OutputContainerProps) => {
    const OUTPUT_SUBTITLES = "outputSubtitles";
    const DOWNLOAD_SUBTITLES = "downloadSubtitles";

    const [activeTab, setActiveTab] = useState<string>(OUTPUT_SUBTITLES);

    const handleActiveTab = (tabId: string) => {
        setActiveTab(tabId);
    }

    const handleDownload = () => {
        const filename = 'output.srt';
        downloadTextFile({name: filename, content: textOutput});
    };

    const downloadTextFile = (file: FileContent) => {
        const { name, content } = file;
        const blob = new Blob([content as BlobPart], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

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
                        <div className="flex-row">
                            <button id="btnDownload" onClick={handleDownload}>{`Download ${DOWNLOAD_CHAR}`}</button> 
                        </div>
                    </div>
                </div>
            </TabWrapper>
        </TabbedContainer>
    );
};

export default OutputContainer;
