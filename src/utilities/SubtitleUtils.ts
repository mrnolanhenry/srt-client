import StringUtils from "./StringUtils";
import TimeUtils from "./TimeUtils";

abstract class SubtitleUtils { 
    static convertLinesToCues(lines: string[], shouldSequence = true): VTTCue[] {
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
                currentLineNumber = shouldSequence ? currentLineNumber + 1 : Number(newLine);
                currentStartTime = null;
                currentEndTime = null;
                currentSubtitleText = [];
            }
            else if (line.includes(" --> ")) {
                // line is a timecode line
                const {startTimeString, endTimeString} = SubtitleUtils.getStartAndEndString(newLine);
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

    static convertCuesToLines(cues: VTTCue[], shouldSequence: boolean = true): string[] {
        let lines: string[] = [];
        let currentLineNumber = 0;
        cues.forEach((cue) => {
            const cueLines = cue.text.split("\n");
            if (cueLines.some(cueLine => cueLine !== "")) {
                currentLineNumber++;
                const lineNumber = shouldSequence || !StringUtils.isLineNumber(cue.id) ? currentLineNumber : Number(cue.id);
                lines.push(lineNumber.toString());

                const newStartString = TimeUtils.convertMillisecsToString(cue.startTime * 1000);
                const newEndString = TimeUtils.convertMillisecsToString(cue.endTime * 1000);
                
                const timeCodeString = newStartString + " --> " + newEndString;
                lines.push(timeCodeString);

                cueLines.forEach(cueLine => {
                    lines.push(cueLine);
                });
                lines.push("");
            }
        });

        return lines;
    }

    static sequenceCues = (cues: VTTCue[],): VTTCue[] => {
        return cues.map((cue, index) => {
            const newCue = new VTTCue(cue.startTime, cue.endTime,  cue.text);
            newCue.id = (index + 1).toString();
            return newCue;
        })
    };

    static scrubCues = (cues: VTTCue[], shouldSequence: boolean = true): VTTCue[] => {
        let newCues: VTTCue[] = [];
        cues.forEach((cue, index) => {
            const cueLines = cue.text.split("\n");
            const scrubbedLines = cueLines.map(line => this.scrubNonDialogue(line));
            if (scrubbedLines.some(scrubbedLine => scrubbedLine !== "")) {
                const newCue = new VTTCue(cue.startTime, cue.endTime,  cue.text);
                newCue.id = shouldSequence ? (index + 1).toString() : cue.id;
                newCues.push(newCue);
            }
        });
        return newCues;
    };

    static scrubNonDialogue(line: string): string {
        let newLine = line;
        newLine = StringUtils.removeStartAndEndChars(newLine, "(",")");
        newLine = StringUtils.removeStartAndEndChars(newLine, "[","]");

        // TODO: Consider doing string.trim or trimEnd in removeStartAndEndChars method 
        // to avoid doing this last call.
        newLine = StringUtils.removeStartAndEndChars(newLine, "[","] ");
        return newLine;
    }

    static offsetCues(cues: VTTCue[], offset: number, lineNumberToStartOffset: number, lineNumberToStopOffset: number | null = null, shouldSequence: boolean = true): VTTCue[] {
        let newCues: VTTCue[] = [];
        cues.forEach((cue, index) => {
            const cueLines = cue.text.split("\n");
            if (cueLines.some(cueLine => cueLine !== "")) {
                const lineNumber = Number(cue.id);
                let newCueStartTime = cue.startTime;
                let newCueEndTime = cue.endTime;
                const isPastStopOffsetNumber = (lineNumberToStopOffset !== null && lineNumber > lineNumberToStopOffset);
                if (lineNumber >= lineNumberToStartOffset && !isPastStopOffsetNumber) {
                    newCueStartTime = ((newCueStartTime * 1000) + offset) / 1000;
                    newCueEndTime = ((newCueEndTime * 1000) + offset) / 1000;
                }
                const newCue = new VTTCue(newCueStartTime, newCueEndTime, cue.text);
                newCue.id = shouldSequence ? (index + 1).toString() : cue.id;
                newCues.push(newCue);
            }
        });
        return newCues;
    };
}

export default SubtitleUtils;