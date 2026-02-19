import './TimeControl.css';

interface TimeControlProps {
  lineStartInput: number | null;
  timeInput: Date;
  handleHoursChange: (event: any) => void;
  handleMinutesChange: (event: any) => void;
  handleSecondsChange: (event: any) => void;
  handleMillisecondsChange: (event: any) => void;
}

const TimeControl = ({ timeInput, handleHoursChange, handleMinutesChange, handleSecondsChange, handleMillisecondsChange }: TimeControlProps) => {

  return (
    <>
      <div className="flex-column">
        <div className="flex-row">
          <div className="flex-column centered-column">
            <div className="flex-row">
              <small>Hours</small>
            </div>
            <div className="flex-row">
              <input type="number" id="hoursInput" name="hoursInput" min={0} max={99} step={1} size={2} onChange={handleHoursChange} value={timeInput.getUTCHours()} />
              <span className="time-separator"> : </span>
            </div>
          </div>
          <div className="flex-column centered-column">
            <div className="flex-row">
              <small>Minutes</small>
            </div>
            <div className="flex-row">
              <input type="number" id="minutesInput" name="minutesInput" min={0} max={99} step={1} size={2} onChange={handleMinutesChange} value={timeInput.getUTCMinutes()} />
              <span className="time-separator"> : </span>
            </div>
          </div>
          <div className="flex-column centered-column">
            <div className="flex-row">
              <small>Seconds</small>
            </div>
            <div className="flex-row">
              <input type="number" id="secondsInput" name="secondsInput" min={0} max={99} step={1} size={2} onChange={handleSecondsChange} value={timeInput.getUTCSeconds()} />
              <span className="time-separator"> , </span>
            </div>
          </div>
          <div className="flex-column centered-column">
            <div className="flex-row">
              <small>Milliseconds</small>
            </div>
            <div className="flex-row">
              <input type="number" id="millisecondsInput" name="millisecondsInput" min={0} max={999} step={1} size={3} onChange={handleMillisecondsChange} value={timeInput.getUTCMilliseconds()} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TimeControl;
