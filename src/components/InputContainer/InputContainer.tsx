import type { FileContent } from '../../interfaces/FileContent';
import './InputContainer.css';
import FileViewer from '../FileViewer/FileViewer';
import { useState } from 'react';
import CopyTextArea from '../CopyTextArea/CopyTextArea';
import TabbedContainer from '../TabbedContainer/TabbedContainer';
import TabWrapper from '../TabWrapper/TabWrapper';

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

    const handleActiveTab = (tabId: string) => {
        setActiveTab(tabId);
    }

    return (
        <>
            <TabbedContainer
                activeTab={activeTab}
                id="inputContainer"
                handleActiveTab={handleActiveTab}>
                <TabWrapper
                    containerClassNames={`padded-container`}
                    containerId={INPUT_SUBTITLES}
                    containerTitle="Input Subtitles">
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
                </TabWrapper>
                <TabWrapper
                    containerClassNames=""
                    containerId={UPLOADED_FILES}
                    containerTitle="Uploaded Files"
                    innerContainerClassNames={`${fileContents.length > 0 ? '' : 'padded-container'}`} >
                    <FileViewer 
                        fileContents={fileContents} 
                        handleUploadCallback={handleUploadCallback}
                    />
                </TabWrapper>
            </TabbedContainer>
        </>
    );
};

export default InputContainer;
