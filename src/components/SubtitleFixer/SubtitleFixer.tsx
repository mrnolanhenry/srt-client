import StringUtils from "../../utilities/StringUtils";
import SubtitleUtils from "../../utilities/SubtitleUtils";
import TimeUtils from "../../utilities/TimeUtils";
import './SubtitleFixer.css';

interface SubtitleFixerProps {
  lineStartInput: number;
  lineStopInput: number | null;
  shouldScrubNonDialogue: boolean;
  timeInputString: string;
  textInput: string;
  handleFixCallback: (fixedText: string) => void;
}

const SubtitleFixer = ({ lineStartInput, lineStopInput, shouldScrubNonDialogue, timeInputString, textInput, handleFixCallback }: SubtitleFixerProps) => {
  const handleFix = (): void => {
      const lines = textInput.split("\n");
      const offset = getOffsetAmount(lines);
      if (isNaN(offset)) {
        return console.error('invalid offset amount from current time');
      }
      const newData = sequenceLineNumbers(offsetAndScrubSubtitles(lines,offset));
      handleFixCallback(newData);
  };
  
  const offsetAndScrubSubtitles = (lines: string[], offset: number): string[] => {
    let newSubtitles: string[] = [];
    let currentLineNumber = 1;
    const lineNumberToStartOffset = lineStartInput;
    const lineNumberToStopOffset = lineStopInput ?? null;
    let shouldOffset = false;
    // this annoying extra boolean is to handle the case where an input SRT file has line numbers that are not in increasing order
    // e.g. line 1 through 300 exist, but the next line number is 1 again instead of 301 - in this case, we don't want to offset the second "1" line and following lines
    // This would come up frequently in cases where multiple SRT files are concatenated together
    let shouldStopOffsetting = false;
    lines.forEach(line => {
      let newLine = StringUtils.removeReturnCharacter(line);
      if (line.includes(" --> ") && shouldOffset) {
        // line is a timecode line
        newLine = getNewLineWithOffset(line, offset);
      }
      else if (StringUtils.isLineNumber(newLine)) {
        // line is a line number
        const lineAsNumber = Number(newLine);
        if (!shouldStopOffsetting) {
          if (lineAsNumber >= lineNumberToStartOffset) {
            shouldOffset = true;
          }
          if ((lineNumberToStopOffset !== null && lineAsNumber > lineNumberToStopOffset)) {
            shouldOffset = false;
            shouldStopOffsetting = true;
          }
        }
        currentLineNumber++;
      }
      else {
        // line is actual subtitle or dialogue
        if (shouldScrubNonDialogue) {
          // by default, will scrub lines of bits like "[chuckles]" or "(gasps)"
          newLine = scrubNonDialogue(newLine, "(",")");
          newLine = scrubNonDialogue(newLine, "[","]");
          newLine = scrubNonDialogue(newLine, "[","] ");
        }
      }
      newSubtitles.push(newLine);
    });
    return newSubtitles;
  };

  const sequenceLineNumbers = (lines: string[]): string => {
    let array: string[] = [];
    let currentLineNumber = 1;
    lines.forEach(line => {
      let newLine = StringUtils.removeReturnCharacter(line);
      if (StringUtils.isLineNumber(newLine)) {
        // line is a line number
        newLine = currentLineNumber.toString();
        currentLineNumber++;
      }
      array.push(newLine);
    });
    return array.join("\n");
  };
  
  //TODO: test this function thoroughly - was described as a WIP previously
  const scrubNonDialogue = (line: string, startChar: string, endChar: string): string => {
    let newLine = line;
    const startSearch = line.indexOf(startChar);
    const endSearch = line.indexOf(endChar);
    if (startSearch == 0) {
      if (endSearch !=-1) {
        newLine = newLine.substring(endSearch + 2, newLine.length);
      }
      else {
        newLine = "";
      }
    }
    else if (startSearch != -1) {
      if (endSearch !=-1) {
        newLine = newLine.substring(0, startSearch) + newLine.substring(endSearch + 2, newLine.length);
      }
      else {
        newLine = newLine.substring(0, startSearch);
      }
    }
    else if (startSearch == -1) {
      if (endSearch !=-1) {
        newLine = newLine.substring(endSearch + 2, newLine.length);
      }
    }
    return newLine;
  };
  
  const getNewLineWithOffset = (line: string, offset: number) => {
    let lineWithReturnRemoved = StringUtils.removeReturnCharacter(line);
    const {startTimeString, endTimeString} = SubtitleUtils.getStartAndEndString(lineWithReturnRemoved);
    const newStartTime = TimeUtils.convertStringToMillisecs(startTimeString) as number + offset;
    const newEndTime = TimeUtils.convertStringToMillisecs(endTimeString) as number + offset;
    const newStartString = TimeUtils.convertMillisecsToString(newStartTime);
    const newEndString = TimeUtils.convertMillisecsToString(newEndTime);
    return newStartString + " --> " + newEndString + "\r";
  };
  
  const getOffsetAmount = (dataArr: string[]) => {
    // new Initial time for the first line in the srt file 
    // e.g. 00:01:19,111 (milliseconds format)
    // the difference between the first line's time and the new inital time will be taken and used as an offset for all times
    // e.g. 00:01:49,111 - 00:01:19,111 would return an offset of -00:00:30,000 and all following times in srt would get modified by this amount.
    const newInitialString = timeInputString;
    const lineNumberToStartOffset = lineStartInput;
    const firstLineToOffset = getFirstTimeLineToOffset(dataArr,lineNumberToStartOffset);
    const oldInitialString = getInitialTimeString(firstLineToOffset as string) as string;
    const oldInitialTime = TimeUtils.convertStringToMillisecs(oldInitialString) as number;
    const newInitialTime = TimeUtils.convertStringToMillisecs(newInitialString) as number;
    
    return newInitialTime - oldInitialTime;
  };
  
  const getFirstTimeLineToOffset = (dataArray: string[],lineNumberToStartOffset : number): string | undefined => {
    return dataArray.find((line: string, index: number, array: string[]) => {
      // console.log("getFirstTimeLineToOffset index");
      // console.log(index);
      // console.log("getFirstTimeLineToOffset index");
      // console.log(index);
      // console.log("getFirstTimeLineToOffset array");
      // console.log(array);
      // console.log("getFirstTimeLineToOffset lineNumberToStartOffset");
      // console.log(lineNumberToStartOffset);
      if (index === 0) {
        return false;
      }
      // console.log("getFirstTimeLineToOffset array[index - 1]");
      // console.log(array[index - 1]);
      let prevLine = StringUtils.removeReturnCharacter(array[index - 1]);
      // console.log("getFirstTimeLineToOffset prevLine");
      // console.log(prevLine);
      // console.log("------------------------------------------------------------------");
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
