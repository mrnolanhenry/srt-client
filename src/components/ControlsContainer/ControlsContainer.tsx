import './ControlsContainer.css';
import { useState } from 'react';
import LineNumberControl from '../LineNumberControl/LineNumberControl';
import TimeControl from '../TimeControl/TimeControl';
import TimeUtils from '../../utilities/TimeUtils';

interface ControlsContainerProps {
    lineStartInput: number;
    lineStopInput: number;
    timeInput: Date;
    handleHoursChange: (event: any) => void;
    handleMinutesChange: (event: any) => void;
    handleSecondsChange: (event: any) => void;
    handleMillisecondsChange: (event: any) => void;
    handleLineStartInputChange: (event: any) => void;
    handleLineStopInputChange: (event: any) => void;
}

const ControlsContainer = ({ lineStartInput, lineStopInput, timeInput, handleHoursChange, handleMinutesChange, handleSecondsChange, handleMillisecondsChange, handleLineStartInputChange, handleLineStopInputChange }: ControlsContainerProps) => {
    const SUBTITLE_CONTROLS = "subtitleControls";

    const [activeTab, setActiveTab] = useState<string>(SUBTITLE_CONTROLS);

    return (
        <>
            <div className="flex-row">
                <div className="controls-container-tab">
                    <button className={`controls-container-tablinks ${activeTab === SUBTITLE_CONTROLS ? 'active' : ''}`} onClick={() => setActiveTab(SUBTITLE_CONTROLS)}>Controls</button>
                </div>
            </div>
            <div className="flex-row controls-tab-content-row">
                <div className="flex-column full-width">
                    <div id="controlsSubtitles" className={`controls-container-tabcontent padded-container ${activeTab === SUBTITLE_CONTROLS ? '' : 'hidden'}`}>
                        <div className="inner-tabcontent-container">
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ControlsContainer;
