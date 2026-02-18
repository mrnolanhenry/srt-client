// import { useState, type BaseSyntheticEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import type { FileContent } from '../../interfaces/FileContent';
import './FileDownload.css';

interface FileDownloadProps {
  buttonClassNames?: string;
  buttonId?: string;
  defaultFileName: string;
  label: string;
  textOutput: string;
}

const FileDownload = ({ buttonClassNames, buttonId, defaultFileName, label, textOutput }: FileDownloadProps) => {
  const [downloadFileName, setDownloadFileName] = useState<string>(defaultFileName);

  const fileNameInputRef = useRef<HTMLInputElement>(null);

  // When user sets a new default download name (e.g. uploads their first input file at any point)
  // default to that name, unless user has already input a download file name
  useEffect(() => {
    if (!fileNameInputRef.current?.value) {
      setDownloadFileName(defaultFileName);
    }
  }, [defaultFileName]);
  
  const handleDownload = (): void => {
      downloadTextFile({name: downloadFileName, content: textOutput});
  };

  const handleChangeName = (event: any): void => {
    if (event.target.value) {
      let nameValue = event.target.value;
      const hasTextFileExtension = nameValue.endsWith(".srt") || nameValue.endsWith(".txt");
      if (!hasTextFileExtension) {
        nameValue += ".srt";
      }
      setDownloadFileName(nameValue);
    }
    else {
      setDownloadFileName(defaultFileName);
    }
  }

  const downloadTextFile = (file: FileContent): void => {
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
    <>
      <div className="file-download flex-row centered-row">
        <label htmlFor={`${buttonId}-input`}>Name your file:</label>
        <input id={`${buttonId}-input`} ref={fileNameInputRef} onChange={handleChangeName} placeholder={downloadFileName} />
        <button id={buttonId} className={`file-download-button ${buttonClassNames ?? ''}`} onClick={handleDownload}>{label}</button> 
      </div>
    </>
  );
};

export default FileDownload;
