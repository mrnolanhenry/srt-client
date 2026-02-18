import type Time from "../../classes/Time";
import type { ScrubCharacterSet } from "../../interfaces/ScrubCharacterSet";
import StringUtils from "../../utilities/StringUtils";
import SubtitleUtils from "../../utilities/SubtitleUtils";
import TimeUtils from "../../utilities/TimeUtils";
import './SubtitleFixer.css';

interface SubtitleFixerProps {
  lineStartInput: number;
  lineStopInput: number | null;
  scrubCharacters: ScrubCharacterSet[];
  shouldOffsetTimecodes: boolean;
  shouldScrubNonDialogue: boolean;
  timeInput: Time;
  textInput: string;
  handleFixSubtitles: (fixedCues: VTTCue[]) => void;
}

const SubtitleFixer = ({ lineStartInput, lineStopInput, scrubCharacters, shouldOffsetTimecodes, shouldScrubNonDialogue, timeInput, textInput, handleFixSubtitles }: SubtitleFixerProps) => {
  const handleFix = (): void => {
      const lines = textInput.split("\n");

      // Convert subtitle input lines to cues without altering timecodes or scrubbing non-dialogue
      let inputCues: VTTCue[] = SubtitleUtils.convertLinesToCues(lines, false);

      // THEN perform time code adjustments and/or scrubbing on the VTTCue[] 
      if (shouldScrubNonDialogue) {
        inputCues = SubtitleUtils.scrubCues(inputCues, scrubCharacters, false);
      }
      if (shouldOffsetTimecodes) {
        const offset = getOffsetAmount(inputCues);
        if (isNaN(offset)) {
          return console.error('invalid offset amount from current time');
        }
        inputCues = SubtitleUtils.offsetCues(inputCues, offset, lineStartInput, lineStopInput, false);
      }

      handleFixSubtitles(inputCues);
  };

  const getOffsetAmount = (cues: VTTCue[]) => {
    // new Start time for the first line to be offset in the srt file 
    // e.g. 00:01:19,111 (milliseconds format)
    // the difference between the first line's time and the new inital time will be taken and used as an offset for all times
    // e.g. 00:01:49,111 - 00:01:19,111 would return an offset of -00:00:30,000 and all following times in srt would get modified by this amount.
    const firstCueToOffset = getFirstCueToOffset(cues, lineStartInput);
    const oldStartTime = (firstCueToOffset?.startTime as number) * 1000;
    const newStartTime = TimeUtils.getTimeInTotalMilliseconds(timeInput);
    
    return newStartTime - oldStartTime;
  };

  const getFirstCueToOffset = (cues: VTTCue[], lineNumberToStartOffset : number): VTTCue | undefined => {
    return cues.find((cue: VTTCue) => {
      return StringUtils.isLineNumber(cue.id) && Number(cue.id) >= lineNumberToStartOffset;
    });
  };
  
  return (
    <>
      <button id="btnFix" type="button" onClick={handleFix}>Fix Subtitles</button>
    </>
  );
};

export default SubtitleFixer;
