import StringUtils from "../../utilities/StringUtils";
import SubtitleUtils from "../../utilities/SubtitleUtils";
import TimeUtils from "../../utilities/TimeUtils";
import './SubtitleFixer.css';

interface SubtitleFixerProps {
  lineStartInput: number;
  lineStopInput: number | null;
  shouldOffsetTimecodes: boolean;
  shouldScrubNonDialogue: boolean;
  timeInputString: string;
  textInput: string;
  handleFixCallback: (fixedText: string) => void;
}

const SubtitleFixer = ({ lineStartInput, lineStopInput, shouldOffsetTimecodes, shouldScrubNonDialogue, timeInputString, textInput, handleFixCallback }: SubtitleFixerProps) => {
  const handleFix = (): void => {
      const lines = textInput.split("\n");
      const offset = shouldOffsetTimecodes ? getOffsetAmount(lines) : 0;
      if (isNaN(offset)) {
        return console.error('invalid offset amount from current time');
      }

      // Convert subtitle input lines to cues without altering timecodes or scrubbing non-dialogue
      let inputCues: VTTCue[] = SubtitleUtils.convertLinesToCues(lines, false);

      // THEN perform time code adjustments and/or scrubbing on the VTTCue[] 
      if (shouldScrubNonDialogue) {
        inputCues = SubtitleUtils.scrubCues(inputCues, false);
      }
      if (shouldOffsetTimecodes) {
        inputCues = SubtitleUtils.offsetCues(inputCues, offset, lineStartInput, lineStopInput, false);
      }

      // THEN convert back to string[] and (eventually) conditionally choose to sequence based on form control.
      const newerLines = SubtitleUtils.convertCuesToLines(inputCues, true).join("\n");

      handleFixCallback(newerLines);
  };
  
  const getOffsetAmount = (lines: string[]) => {
    // new Initial time for the first line in the srt file 
    // e.g. 00:01:19,111 (milliseconds format)
    // the difference between the first line's time and the new inital time will be taken and used as an offset for all times
    // e.g. 00:01:49,111 - 00:01:19,111 would return an offset of -00:00:30,000 and all following times in srt would get modified by this amount.
    const newInitialString = timeInputString;
    const lineNumberToStartOffset = lineStartInput;
    const firstLineToOffset = getFirstTimeLineToOffset(lines, lineNumberToStartOffset);
    const oldInitialString = getInitialTimeString(firstLineToOffset as string) as string;
    const oldInitialTime = TimeUtils.convertStringToMillisecs(oldInitialString) as number;
    const newInitialTime = TimeUtils.convertStringToMillisecs(newInitialString) as number;
    
    return newInitialTime - oldInitialTime;
  };
  
  const getFirstTimeLineToOffset = (lines: string[],lineNumberToStartOffset : number): string | undefined => {
    return lines.find((line: string, index: number, array: string[]) => {
      if (index === 0) {
        return false;
      }
      let prevLine = StringUtils.removeReturnCharacter(array[index - 1]);
      return StringUtils.isLineNumber(prevLine) && (Number(prevLine) >= lineNumberToStartOffset) && line.includes(" --> ");
    });
  };
  
  const getInitialTimeString = (firstLine: string): string | undefined => {
    const oldInitialString = firstLine.split(" --> ").shift();
    // console.log('old time at that line: ' + oldInitialString);
    return oldInitialString;
  };
  
  return (
    <>
      <button id="btnFix" onClick={handleFix}>Fix Subtitles</button>
    </>
  );
};

export default SubtitleFixer;
