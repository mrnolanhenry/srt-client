import './ControlsContainer.css';
import { useState } from 'react';
import LineNumberControl from '../LineNumberControl/LineNumberControl';
import TimeControl from '../TimeControl/TimeControl';
import TimeUtils from '../../utilities/TimeUtils';
import TabbedContainer from '../TabbedContainer/TabbedContainer';
import TabWrapper from '../TabWrapper/TabWrapper';

interface ControlsContainerProps {
    lineStartInput: number;
    lineStopInput: number;
    shouldOffsetTimecodes: boolean;
    shouldScrubNonDialogue: boolean;
    timeInput: Date;
    handleHoursChange: (event: any) => void;
    handleMinutesChange: (event: any) => void;
    handleSecondsChange: (event: any) => void;
    handleMillisecondsChange: (event: any) => void;
    handleLineStartInputChange: (event: any) => void;
    handleLineStopInputChange: (event: any) => void;
    handleShouldOffsetToggle: () => void;
    handleShouldScrubToggle: () => void;
}

const ControlsContainer = ({ 
    lineStartInput, lineStopInput, shouldOffsetTimecodes, shouldScrubNonDialogue, timeInput, 
    handleHoursChange, handleMinutesChange, handleSecondsChange, handleMillisecondsChange, 
    handleLineStartInputChange, handleLineStopInputChange, handleShouldOffsetToggle, handleShouldScrubToggle }: ControlsContainerProps) => {
    const SUBTITLE_CONTROLS = "subtitleControls";

    const [activeTab, setActiveTab] = useState<string>(SUBTITLE_CONTROLS);

    const handleActiveTab = (tabId: string) => {
        setActiveTab(tabId);
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
                    <fieldset className="empty" disabled={!shouldScrubNonDialogue}>
                        <legend>
                            <input type="checkbox" id="shouldOffsetCheckbox" name="shouldOffsetCheckbox" checked={shouldScrubNonDialogue} onChange={handleShouldScrubToggle} />
                            <label htmlFor="shouldOffsetCheckbox">Remove non-dialogue? <small>e.g. "{`(chuckles)`}" or "{`[coughs]`}"</small></label>
                        </legend>
                    </fieldset>
                </form>
            </TabWrapper>
        </TabbedContainer>
    );
};

export default ControlsContainer;
