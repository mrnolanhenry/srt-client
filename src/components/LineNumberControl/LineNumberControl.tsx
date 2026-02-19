import NullableNumberInput from '../common/NullableNumberInput/NullableNumberInput';
import './LineNumberControl.css';

interface LineNumberControlProps {
  defaultLineStart: number;
  lineStartInput: number | null;
  lineStopInput: number | null;
  handleLineStartInputChange: (event: any) => void;
  handleLineStopInputChange: (event: any) => void;
}

const LineNumberControl = ({ defaultLineStart, lineStartInput, lineStopInput, handleLineStartInputChange, handleLineStopInputChange }: LineNumberControlProps) => {

  return (
    <>
      <div className="flex-column">
        <div className="flex-row spaced-between-row">
          <div className="flex-column align-start-column">
            <div className="flex-row">
              <small>Fix Lines Numbered: </small>
            </div>
            <div className="flex-row centered-row">
              <NullableNumberInput 
                className="line-input"
                defaultValidNumber={defaultLineStart}
                id="lineStartInput" 
                name="lineStartInput"
                step={1} 
                size={5} 
                value={lineStartInput as number}
                handleChangeCallback={handleLineStartInputChange}
              />
              <small className="line-input"> through </small>
              <NullableNumberInput  
                className="line-input"
                id="lineStopInput"
                name="lineStopInput"
                step={1}
                size={5}
                value={lineStopInput as number} 
                handleChangeCallback={handleLineStopInputChange}
              />
              <small className="line-input">{` (leave blank to adjust to end)`}</small>
            </div>
          </div>            
        </div>
      </div>
    </>
  );
};

export default LineNumberControl;
