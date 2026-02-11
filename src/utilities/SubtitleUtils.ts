import StringUtils from "./StringUtils";
import TimeUtils from "./TimeUtils";

abstract class SubtitleUtils { 
    static convertLinesToCues(lines: string[]): VTTCue[] {
        let cues: VTTCue[] = [];
        let currentLineNumber: number = 0;
        let currentStartTime: number | null = null;
        let currentEndTime: number | null = null;
        let currentSubtitleText: string[] = [];
        lines.forEach(line => {
            let newLine = StringUtils.removeReturnCharacter(line);
            if (StringUtils.isLineNumber(newLine)) {
            // line is a line number
            // we have reached a new cue, so we can push the previous cue if it exists
            if (currentLineNumber > 0 && currentLineNumber !== undefined && currentStartTime !== null && currentStartTime !== undefined && currentEndTime !== null && currentEndTime !== undefined) {
                const cue = new VTTCue(currentStartTime as number / 1000, currentEndTime as number / 1000,  currentSubtitleText.join("\n"));
                cue.id = currentLineNumber.toString();
                cues.push(cue);
            }
            // reset current subtitle text and start and end times for the new cue
            currentLineNumber = Number(newLine);
            currentStartTime = null;
            currentEndTime = null;
            currentSubtitleText = [];
            }
            else if (line.includes(" --> ")) {
                // line is a timecode line
                const {startTimeString, endTimeString} = SubtitleUtils.getStartAndEndString(line);
                currentStartTime = TimeUtils.convertStringToMillisecs(startTimeString) as number;
                currentEndTime = TimeUtils.convertStringToMillisecs(endTimeString) as number;
            }
            else {
            // line is actual subtitle or dialogue
            if (newLine !== "") {
                currentSubtitleText.push(newLine);
            }
            }
        });
        // Still need to push the last cue after the loop ends
        const cue = new VTTCue(currentStartTime as unknown as number / 1000, currentEndTime as unknown as number / 1000, currentSubtitleText.join("\n"));
        cue.id = currentLineNumber.toString();
        cues.push(cue);
        return cues;
    };

    static getStartAndEndString(lineString: string): {startTimeString: string, endTimeString: string} {
        const lineArr = lineString.split(" --> ");
        const startTimeString = lineArr[0];
        const endTimeString = lineArr[1]
        return {startTimeString, endTimeString};
    };
}

export default SubtitleUtils;