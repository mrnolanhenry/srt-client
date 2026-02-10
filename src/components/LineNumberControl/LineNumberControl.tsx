import './LineNumberControl.css';

interface LineNumberControlProps {
  lineStartInput: number;
  lineStopInput: number | null;
  handleLineStartInputChange: (event: any) => void;
  handleLineStopInputChange: (event: any) => void;
}

const LineNumberControl = ({ lineStartInput, lineStopInput, handleLineStartInputChange, handleLineStopInputChange }: LineNumberControlProps) => {

  return (
    <>
      <div className="flex-column">
        <div className="flex-row spaced-between-row">
          <div className="flex-column align-start-column">
            <div className="flex-row">
              <small>Fix Lines Numbered: </small>
            </div>
            <div className="flex-row centered-row">
              <input type="number" id="lineStartInput" className="line-input" name="lineStartInput" step={1} size={5} onChange={handleLineStartInputChange} value={lineStartInput} />
              <small className="line-input"> through </small>
              <input type="number" id="lineStopInput" className="line-input" name="lineStopInput" step={1} size={5} onChange={handleLineStopInputChange} value={lineStopInput as number ?? ""} />
              <small className="line-input">{` (leave blank to adjust to end)`}</small>
            </div>
          </div>            
        </div>
      </div>
    </>
  );
};

export default LineNumberControl;
