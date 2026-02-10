import './OutputContainer.css';
import { useState } from 'react';
import CopyTextArea from '../CopyTextArea/CopyTextArea';

interface OutputContainerProps {
    scrollRef: React.RefObject<HTMLTextAreaElement>;
    textOutput: string;
    handleScroll: (event: any) => void;
    handleTextOutputChange: (event: any) => void;
}

const OutputContainer = ({ scrollRef, textOutput, handleScroll, handleTextOutputChange }: OutputContainerProps) => {
    const OUTPUT_SUBTITLES = "outputSubtitles";

    const [activeTab, setActiveTab] = useState<string>(OUTPUT_SUBTITLES);

    return (
        <>
            <div className="flex-row">
                <div className="output-container-tab">
                    <button className={`output-container-tablinks ${activeTab === OUTPUT_SUBTITLES ? 'active' : ''}`} onClick={() => setActiveTab(OUTPUT_SUBTITLES)}>Fixed Subtitles</button>
                </div>
            </div>
            <div className="flex-row output-tab-content-row">
                <div className="flex-column full-width">
                    <div id="outputSubtitles" className={`output-container-tabcontent padded-container ${activeTab === OUTPUT_SUBTITLES ? '' : 'hidden'}`}>
                        <div className="inner-tabcontent-container">
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OutputContainer;
