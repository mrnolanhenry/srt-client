import type { FileContent } from '../../interfaces/FileContent';
import './InputContainer.css';
import FileViewer from '../FileViewer/FileViewer';
import { useState } from 'react';
import CopyTextArea from '../CopyTextArea/CopyTextArea';

interface InputContainerProps {
  fileContents: FileContent[];
  scrollRef: React.RefObject<HTMLTextAreaElement>;
  textInputs: string[];
  handleScroll: (event: any) => void;
  handleTextInputChange: (event: any) => void;
  setFileContents: React.Dispatch<React.SetStateAction<FileContent[]>>;
}

const InputContainer = ({ fileContents, scrollRef, textInputs, handleScroll, handleTextInputChange, setFileContents }: InputContainerProps) => {
    const INPUT_SUBTITLES = "inputSubtitles";
    const UPLOADED_FILES = "uploadedFiles";

    const [activeTab, setActiveTab] = useState<string>(INPUT_SUBTITLES);

    const handleUploadCallback = (contents: FileContent[]) => {
        // Add new files rather than replace them.
        setFileContents([...fileContents, ...contents]);
        // OPTIONAL - show Uploaded Files tab after uploading file(s)
        // setActiveTab(UPLOADED_FILES);
    }

    return (
        <>
            <div className="flex-row">
                <div className="input-container-tab">
                    <button className={`input-container-tablinks ${activeTab === INPUT_SUBTITLES ? 'active' : ''}`} onClick={() => setActiveTab(INPUT_SUBTITLES)}>Edit Subtitles</button>
                    <button className={`input-container-tablinks ${activeTab === UPLOADED_FILES ? 'active' : ''}`} onClick={() => setActiveTab(UPLOADED_FILES)}>Uploaded Files</button>
                </div>
            </div>
            <div className="flex-row input-tab-content-row">
                <div className="flex-column full-width">
                    <div id="inputSubtitles" className={`input-container-tabcontent padded-container ${activeTab === INPUT_SUBTITLES ? '' : 'hidden'}`}>
                        <div className="inner-tabcontent-container">
                            <div className="flex-row">  
                                <CopyTextArea 
                                    className="full-width no-resize" 
                                    cols={50} 
                                    id="srtInputDisplay"
                                    rows={23} 
                                    onChange={handleTextInputChange}
                                    onScroll={handleScroll}
                                    scrollRef={scrollRef}
                                    value={textInputs[0]}
                                />              
                            </div>
                        </div>
                    </div>
                    <div id="uploadedFiles" className={`input-container-tabcontent ${activeTab === UPLOADED_FILES ? '' : 'hidden'}`}>
                        <FileViewer 
                            fileContents={fileContents} 
                            handleUploadCallback={handleUploadCallback} 
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default InputContainer;
