import { useEffect, useState } from 'react';
import type { FileContent } from '../../interfaces/FileContent';
import './FileViewer.css';
import FileUpload from '../FileUpload/FileUpload';
import CopyTextArea from '../CopyTextArea/CopyTextArea';
import { UPLOAD_CHAR } from '../../constants/constants';

interface FileViewerProps {
  fileContents: FileContent[];
  handleUploadCallback: (event: any) => void;
}

const FileViewer = ({ fileContents, handleUploadCallback }: FileViewerProps) => {
  // const [activeTab, setActiveTab] = useState<string>(fileContents && fileContents.length ? fileContents[0].name : "");
  const [activeTab, setActiveTab] = useState<string>("");
  const uploadFilesLabel = `Upload ${fileContents.length === 0 ? "" : "More"} Files ${UPLOAD_CHAR}`;

    useEffect(() => {
      if (fileContents && fileContents.length) {
        setActiveTab(fileContents[0].name);
      }
    }, [fileContents[0]]);

  const getAbbreviatedFileName = (fileName: string, maxLength: number): string => {
    if (fileName.length <= maxLength) {
      return fileName;
    }
    return fileName.substring(0, maxLength) + "...";
  };

  return (
    <>
      {fileContents.length > 0 ? (
        <>
          <div className="flex-row">
            <div className="flex-column file-viewer-tab">
              <div id="fileUploadColumn" className="flex-column">
                <button className="file-viewer-tablinks file-upload-wrapped-button">
                  <FileUpload
                      label={uploadFilesLabel}
                      handleUploadCallback={handleUploadCallback} 
                  />
                </button>
              </div>
              {fileContents.map((file, index) => (
                <button key={`file-viewer-tablinks-${index}`} className={`file-viewer-tablinks ${activeTab === file.name ? 'active' : ''}`} onMouseOver={() => setActiveTab(file.name)}>{getAbbreviatedFileName(file.name, 20)}</button>
              ))}
            </div>
            {fileContents.map((file, index) => (
              <div key={`file-viewer-tabContent-${index}`} id={`file-viewer-tabContent-${file.name}`} className={`file-viewer-tabcontent ${activeTab === file.name ? '' : 'hidden'}`}>
                <CopyTextArea 
                  className="full-width no-resize" 
                  cols={50} 
                  id={file.name}
                  isReadOnly={true}
                  rows={23} 
                  onChange={() => {
                    // TODO: Ultimately want a function here and for each file's contents to not be readOnly
                  }} 
                  value={(file.content as string) ?? ""}
                /> 
              </div>      
            ))}
          </div>
          <div className="clearfix"></div>
        </>
      ) : (
        <div className="flex-row padded-row">
            <FileUpload
                label={uploadFilesLabel}
                handleUploadCallback={handleUploadCallback} 
            />
        </div>
      )}
    </>
  );
};

export default FileViewer;
