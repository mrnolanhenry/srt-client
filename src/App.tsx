import { useEffect, useRef, useState } from 'react';
import './App.css';
import Time from './classes/Time';
import InputContainer from './components/InputContainer/InputContainer';
import OutputContainer from './components/OutputContainer/OutputContainer';
import StickyFooter from './components/StickyFooter/StickyFooter';
import SubtitleFixer from './components/SubtitleFixer/SubtitleFixer';
import VideoUploadAndPlayer from './components/VideoUploadAndPlayer/VideoUploadAndPlayer';
import useDebounce from './hooks/useDebounce';
import type { FileContent } from './interfaces/FileContent';
import TimeUtils from './utilities/TimeUtils';
import SubtitleUtils from './utilities/SubtitleUtils';
import ControlsContainer from './components/ControlsContainer/ControlsContainer';

function App() {
  const INSTRUCTIONS_TEXT = `Update timecodes on existing .srt files with ease!
    \nEnter your subtitles here or upload multiple .srt files using the button in the 'Uploaded Files' tab. There you can reference your other files to work with.
    \nBy default, the contents of the first file uploaded will appear here.
    \nMake any edits needed in this tab, then choose settings in the 'Controls' area to adjust the timecodes on specific line numbers and click the 'Fix' button.`;
  // TODO: Consider making textInputs a single string vs. string[]
  const [textInputs, setTextInputs] = useState<string[]>([INSTRUCTIONS_TEXT]);
  const [textOutput, setTextOutput] = useState<string>('Your fixed .srt file with new timecodes will appear here.');
  const [cues, setCues] = useState<VTTCue[]>([]);
  const debouncedCues = useDebounce(cues, 500);
  const [fileContents, setFileContents] = useState<FileContent[]>([]);
  const [lineStartInput, setLineStartInput] = useState<number>(1);
  const [lineStopInput, setLineStopInput] = useState<number | null>(null);
  const [timeInput, setTimeInput] = useState<Time>(new Time(0, 0, 0, 0));

  const shouldScrubNonDialogue = false;

  const videoRef = useRef<HTMLVideoElement>(null);

  const refInputTextArea = useRef<HTMLTextAreaElement>(null);
  const refOutputTextArea = useRef<HTMLTextAreaElement>(null);

  const handleScroll = (event: any) => {
    const { scrollTop, scrollLeft } = event.target;
    // Determine which textarea was scrolled and update the other one
    if (event.target === refInputTextArea.current) {
      if (refOutputTextArea.current) {
        refOutputTextArea.current.scrollTop = scrollTop;
        refOutputTextArea.current.scrollLeft = scrollLeft;
      }
    } else if (event.target === refOutputTextArea.current) {
      if (refInputTextArea.current) {
        refInputTextArea.current.scrollTop = scrollTop;
        refInputTextArea.current.scrollLeft = scrollLeft;
      }
    }
  };

  useEffect(() => {
    if (fileContents && fileContents.length) {
      setTextInputs(fileContents.map((fileContent) => fileContent.content as string));
    }
  }, [fileContents.length]);

  const handleTextInputChange = (event: any) => {
    const newTextInputs = [...textInputs];
    newTextInputs[0] = event.target.value;
    setTextInputs(newTextInputs);
  };

  const handleTextOutputChange = (event: any) => {
    setTextOutput(event.target.value);
    // need to also update cues in case user manually edits output textarea (e.g. to add new lines or remove lines)
    // TODO: could perform some validation here to make sure the text is in the correct format before updating cues, but for now will just assume user is inputting valid subtitle text
    // TODO: could be more efficient and only update cues that were changed vs. regenerating all cues, but this is simpler to implement for now and performance should be fine for typical subtitle file sizes
    const newCues = SubtitleUtils.convertLinesToCues(event.target.value.split("\n"));
    setCues(newCues);
  };

  const handleFixSubtitles = (newData: string) => {
    const newCues = SubtitleUtils.convertLinesToCues(newData.split("\n"));
    setCues(newCues);
    setTextOutput(newData);
  };

  const handleHoursChange = (event: any) => {
    if (event.target.validity.valid) {
      const validNumber = !isNaN(event.target.valueAsNumber) ? event.target.valueAsNumber : 0;
      const newTimeInput = TimeUtils.getNewTimeWithHours(timeInput, validNumber);
      setTimeInput(newTimeInput);
    }
    else {
      console.log("TODO: Handle Invalid number input later");
    }
  };

  const handleMinutesChange = (event: any) => {
    if (event.target.validity.valid) {
      const validNumber = !isNaN(event.target.valueAsNumber) ? event.target.valueAsNumber : 0;
      const newTimeInput = TimeUtils.getNewTimeWithMinutes(timeInput, validNumber);
      setTimeInput(newTimeInput);
    }
    else {
      console.log("TODO: Handle Invalid number input later");
    }
  };

  const handleSecondsChange = (event: any) => {
    if (event.target.validity.valid) {
      const validNumber = !isNaN(event.target.valueAsNumber) ? event.target.valueAsNumber : 0;
      const newTimeInput = TimeUtils.getNewTimeWithSeconds(timeInput, validNumber);
      setTimeInput(newTimeInput);
    }
    else {
      console.log("TODO: Handle Invalid number input later");
    }
  };

  const handleMillisecondsChange = (event: any) => {
    if (event.target.validity.valid) {
      const validNumber = !isNaN(event.target.valueAsNumber) ? event.target.valueAsNumber : 0;
      const newTimeInput = TimeUtils.getNewTimeWithMilliseconds(timeInput, validNumber);
      setTimeInput(newTimeInput);
    }
    else {
      console.log("TODO: Handle Invalid number input later");
    }
  };

  const handleLineStartInputChange = (event: any) => {
    if (event.target.validity.valid) {
      if (!isNaN(event.target.valueAsNumber)) {
        setLineStartInput(event.target.valueAsNumber);
      }
      else {
        setLineStartInput(1);
      }
    }
    else {
      console.log("TODO: Handle Invalid number input later");
    }
  };

  const handleLineStopInputChange = (event: any) => {
    if (event.target.validity.valid) {
      setLineStopInput(event.target.valueAsNumber);
    }
    else {
      console.log("TODO: Handle Invalid number input later");
    }
  };

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
    <>
      <div id="appContainer">
        <div id="mainContent">
          <div className="flex-column full-width centered-column padded-column">
            <div id="headerRow" className="flex-row section-row">
              <div className="flex-column">
                <h4>Fix Subtitles</h4>
              </div>
            </div>
          </div>
          <div className="flex-column full-width centered-column">
            <div className="section-row flex-row">
              <div id="controlColumn" className="flex-column centered-column">
                <ControlsContainer
                  lineStartInput={lineStartInput}
                  lineStopInput={lineStopInput as number}
                  timeInput={timeInput}
                  handleHoursChange={handleHoursChange}
                  handleMinutesChange={handleMinutesChange}
                  handleSecondsChange={handleSecondsChange}
                  handleMillisecondsChange={handleMillisecondsChange}
                  handleLineStartInputChange={handleLineStartInputChange}
                  handleLineStopInputChange={handleLineStopInputChange}
                />
              </div>
              <div id="videoContainerColumn" className="flex-column centered-column">
                <VideoUploadAndPlayer
                  cues={debouncedCues}
                  videoRef={videoRef as React.RefObject<HTMLVideoElement>}
                  timeInput={timeInput}
                />
              </div>
            </div>
          </div>
          <div className="flex-column full-width centered-column">
            <div className="flex-row section-row">
              <div id="inputContainerColumn" className="flex-column padded-column">
                <InputContainer
                  fileContents={fileContents}
                  scrollRef={refInputTextArea as React.RefObject<HTMLTextAreaElement>}
                  textInputs={textInputs}
                  handleScroll={handleScroll}
                  handleTextInputChange={handleTextInputChange}
                  setFileContents={setFileContents} 
                />
              </div>
              <div id="outputContainerColumn" className="flex-column padded-column">
                <OutputContainer
                    scrollRef={refOutputTextArea as React.RefObject<HTMLTextAreaElement>}
                    textOutput={textOutput}
                    handleScroll={handleScroll}
                    handleTextOutputChange={handleTextOutputChange}
                />
              </div>
            </div>
          </div>
        </div>
        <StickyFooter>
          <div className="flex-row spaced-around-row padded-row">
            <div className="flex-column">
              <div className="flex-row">
                <SubtitleFixer 
                  lineStartInput={lineStartInput}
                  lineStopInput={lineStopInput}
                  shouldScrubNonDialogue={shouldScrubNonDialogue}
                  timeInputString={TimeUtils.getDisplayTime(timeInput)}
                  textInput={textInputs[0]}
                  handleFixCallback={handleFixSubtitles}
                />
              </div>
            </div>
            <div className="flex-column">
              <div className="flex-row">
                <button id="btnDownload" onClick={handleDownload}>Download</button> 
              </div>
            </div>
          </div>
        </StickyFooter>
      </div>
    </>
  )
}

export default App
