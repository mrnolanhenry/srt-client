import './ControlsContainer.css';
import { useEffect, useState } from 'react';
import type { ScrubCharacterSet } from '../../interfaces/ScrubCharacterSet';
import TimeUtils from '../../utilities/TimeUtils';
import LineNumberControl from '../LineNumberControl/LineNumberControl';
import TimeControl from '../TimeControl/TimeControl';
import TabbedContainer from '../TabbedContainer/TabbedContainer';
import TabWrapper from '../TabWrapper/TabWrapper';
import CustomCharacterControl from '../CustomCharacterControl/CustomCharacterControl';
import { BRACKET_CLOSE, BRACKET_OPEN, PARENTHESES_CLOSE, PARENTHESES_OPEN, TAG_CLOSE, TAG_OPEN } from '../../constants/constants';
import SubtitleFixer from '../SubtitleFixer/SubtitleFixer';
import type Time from '../../classes/Time';

interface ControlsContainerProps {
    textInput: string;
    timeInput: Date;
    handleFixSubtitles: (cues: VTTCue[]) => void;
    handleTimeInputChange: (newTime: Time) => void;
}

const ControlsContainer = ({ textInput, timeInput, handleFixSubtitles, handleTimeInputChange }: ControlsContainerProps) => {
    const SUBTITLE_CONTROLS = "subtitleControls";

    const [activeTab, setActiveTab] = useState<string>(SUBTITLE_CONTROLS);
    const [lineStartInput, setLineStartInput] = useState<number>(1);
    const [lineStopInput, setLineStopInput] = useState<number | null>(null);
    const [shouldOffsetTimecodes, setShouldOffsetTimecodes] = useState<boolean>(true);
    const [shouldScrubNonDialogue, setShouldScrubNonDialogue] = useState<boolean>(false);
    const [shouldScrubParentheses, setShouldScrubParentheses] = useState<boolean>(true);
    const [shouldScrubBrackets, setShouldScrubBrackets] = useState<boolean>(true);
    const [shouldScrubCustomChar, setShouldScrubCustomChar] = useState<boolean>(false);
    const [customStartChar, setCustomStartChar] = useState<string>(TAG_OPEN);
    const [customEndChar, setCustomEndChar] = useState<string>(TAG_CLOSE);
    const [scrubCharacters, setScrubCharacters] = useState<ScrubCharacterSet[]>([]);

    const getScrubChars = () => {
        let scrubCharacterSets: ScrubCharacterSet[] = [];
        if (shouldScrubNonDialogue) {
            if (shouldScrubBrackets) {
                scrubCharacterSets.push({startChar: BRACKET_OPEN, endChar: BRACKET_CLOSE});
            }
            if (shouldScrubParentheses) {
                scrubCharacterSets.push({startChar: PARENTHESES_OPEN, endChar: PARENTHESES_CLOSE});
            }
            if (shouldScrubCustomChar) {
                scrubCharacterSets.push({startChar: customStartChar, endChar: customEndChar});
            }
        }
        return scrubCharacterSets;
    }

    useEffect(() => {
        setScrubCharacters(getScrubChars());
    },[customStartChar, customEndChar, shouldScrubBrackets, shouldScrubParentheses, shouldScrubCustomChar, shouldScrubNonDialogue]);

    const handleActiveTab = (tabId: string) => {
        setActiveTab(tabId);
    }

    const handleScrubParentheses = () => {
        setShouldScrubParentheses(!shouldScrubParentheses);
    }

    const handleScrubBrackets = () => {
        setShouldScrubBrackets(!shouldScrubBrackets);
    }

    const handleScrubCustomCharToggle = () => {
        setShouldScrubCustomChar(!shouldScrubCustomChar);
    }

    const handleCustomStartCharChange = (event: any) => {
        setCustomStartChar(event.target.value);
    }

    const handleCustomEndCharChange = (event: any) => {
        setCustomEndChar(event.target.value);
    }

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
            handleInvalidNumber();
        }
    };

    const handleLineStopInputChange = (event: any) => {
        if (event.target.validity.valid) {
            setLineStopInput(event.target.valueAsNumber);
        }
        else {
            handleInvalidNumber();
        }
    };

    const handleShouldOffsetToggle = () => {
        setShouldOffsetTimecodes(!shouldOffsetTimecodes);
    }

    const handleShouldScrubToggle = () => {
        setShouldScrubNonDialogue(!shouldScrubNonDialogue);
    }

    const handleHoursChange = (event: any) => {
        if (event.target.validity.valid) {
        const validNumber = !isNaN(event.target.valueAsNumber) ? event.target.valueAsNumber : 0;
        const newTimeInput = TimeUtils.getNewTimeWithHours(timeInput, validNumber);
        handleTimeInputChange(newTimeInput);
        }
        else {
        handleInvalidNumber();
        }
    };

    const handleMinutesChange = (event: any) => {
        if (event.target.validity.valid) {
        const validNumber = !isNaN(event.target.valueAsNumber) ? event.target.valueAsNumber : 0;
        const newTimeInput = TimeUtils.getNewTimeWithMinutes(timeInput, validNumber);
        handleTimeInputChange(newTimeInput);
        }
        else {
        handleInvalidNumber();
        }
    };

    const handleSecondsChange = (event: any) => {
        if (event.target.validity.valid) {
        const validNumber = !isNaN(event.target.valueAsNumber) ? event.target.valueAsNumber : 0;
        const newTimeInput = TimeUtils.getNewTimeWithSeconds(timeInput, validNumber);
        handleTimeInputChange(newTimeInput);
        }
        else {
        handleInvalidNumber();
        }
    };

    const handleMillisecondsChange = (event: any) => {
        if (event.target.validity.valid) {
        const validNumber = !isNaN(event.target.valueAsNumber) ? event.target.valueAsNumber : 0;
        const newTimeInput = TimeUtils.getNewTimeWithMilliseconds(timeInput, validNumber);
        handleTimeInputChange(newTimeInput);
        }
        else {
        handleInvalidNumber();
        }
    };

    const handleInvalidNumber = () => {
        console.log("TODO: Handle Invalid number input later");
    }

    return (
        <TabbedContainer
            activeTab={activeTab}
            id="controlsContainer"
            handleActiveTab={handleActiveTab}
        >
            <TabWrapper
                containerClassNames={`padded-container`}
                containerId={SUBTITLE_CONTROLS}
                containerTitle="Controls"
            >
                <form>
                    <fieldset disabled={!shouldOffsetTimecodes}>
                        <legend>
                            <input type="checkbox" id="shouldOffsetCheckbox" name="shouldOffsetCheckbox" checked={shouldOffsetTimecodes} onChange={handleShouldOffsetToggle} />
                            <label htmlFor="shouldOffsetCheckbox">Adjust timecodes?</label>
                        </legend>
                        <div className="section-row flex-row spaced-between-row full-width">
                            <div className="flex-column padded-column">
                                <LineNumberControl 
                                    lineStartInput={lineStartInput}
                                    lineStopInput={lineStopInput}
                                    handleLineStartInputChange={handleLineStartInputChange}
                                    handleLineStopInputChange={handleLineStopInputChange}
                                />
                            </div>
                            <div className="flex-column padded-column">
                                <TimeControl 
                                    timeInput={timeInput}
                                    lineStartInput={lineStartInput}
                                    handleHoursChange={handleHoursChange}
                                    handleMinutesChange={handleMinutesChange}
                                    handleSecondsChange={handleSecondsChange}
                                    handleMillisecondsChange={handleMillisecondsChange}
                                />
                            </div>
                        </div>
                        <div className="flex-row centered-row full-width">
                            <div className="flex-column padded-column">
                                <div className="flex-row centered-row">
                                    <div className="flex-column">
                                        <span>Selected New Time for Line {lineStartInput}: {TimeUtils.getDisplayTime(timeInput)}</span>
                                    </div>
                                </div>
                            </div>
                        </div> 
                    </fieldset>
                    <fieldset disabled={!shouldScrubNonDialogue}>
                        <legend>
                            <input type="checkbox" id="shouldOffsetCheckbox" name="shouldOffsetCheckbox" checked={shouldScrubNonDialogue} onChange={handleShouldScrubToggle} />
                            <label htmlFor="shouldOffsetCheckbox">Remove non-dialogue?</label>
                        </legend>
                        <div id="scrubLabelRow" className="flex-row">
                            <small>{`Which characters to use? e.g. "(chuckles)" or "[coughs]"`} </small>
                        </div>
                        <div id="scrubNonDialogueRow" className="section-row flex-row align-center-row full-width">
                            <div className="flex-column padded-column">
                                <div className="flex-row">
                                    <input type="checkbox" id="shouldScrubParentheses" checked={shouldScrubParentheses} onChange={handleScrubParentheses} />
                                    <label htmlFor="shouldScrubParentheses">()</label>
                                </div>
                            </div>
                            <div className="flex-column padded-column">
                                <div className="flex-row">
                                    <input type="checkbox" id="shouldScrubBrackets" checked={shouldScrubBrackets} onChange={handleScrubBrackets} />
                                    <label htmlFor="shouldScrubBrackets">[]</label>
                                </div>
                            </div>
                            <CustomCharacterControl 
                                customStartChar={customStartChar}
                                customEndChar={customEndChar}
                                shouldScrubCustomChar={shouldScrubCustomChar}
                                handleCustomStartCharChange={handleCustomStartCharChange}
                                handleCustomEndCharChange={handleCustomEndCharChange}
                                handleScrubCustomCharToggle={handleScrubCustomCharToggle}
                            />
                        </div>
                    </fieldset>
                </form>
                <div className="flex-column">
                    <div className="flex-row centered-row">
                        <SubtitleFixer 
                            lineStartInput={lineStartInput}
                            lineStopInput={lineStopInput}
                            scrubCharacters={scrubCharacters}
                            shouldOffsetTimecodes={shouldOffsetTimecodes}
                            shouldScrubNonDialogue={shouldScrubNonDialogue}
                            timeInput={timeInput}
                            textInput={textInput}
                            handleFixSubtitles={handleFixSubtitles}
                        />
                    </div>
                </div>
            </TabWrapper>
        </TabbedContainer>
    );
};

export default ControlsContainer;
