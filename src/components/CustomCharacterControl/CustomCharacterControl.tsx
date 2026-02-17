import './CustomCharacterControl.css';

interface CustomCharacterControlProps {
  customStartChar: string;
  customEndChar: string;
  shouldScrubCustomChar: boolean;
  handleCustomStartCharChange: (event: any) => void;
  handleCustomEndCharChange: (event: any) => void;
  handleScrubCustomCharToggle: (event: any) => void;
}

const CustomCharacterControl = ({ customStartChar, customEndChar, shouldScrubCustomChar, handleCustomStartCharChange, handleCustomEndCharChange, handleScrubCustomCharToggle }: CustomCharacterControlProps) => {

  return (
    <>
      <div id="customCharacterControl" className="flex-row align-center-row">
          <div className="flex-column">
            <div className="flex-row">
              <fieldset disabled={!shouldScrubCustomChar}>
                <div className="flex-column centered-column padded-column">
                  <div className="flex-row">
                    <small>Start</small>
                  </div>
                  <div className="flex-row">
                    <input id="customStartCharInput" name="customStartCharInput" disabled={!shouldScrubCustomChar} size={1} onChange={handleCustomStartCharChange} value={customStartChar} />
                  </div>
                </div>
                <div className="flex-column centered-column padded-column">
                  <div className="flex-row">
                    <small>End</small>
                  </div>
                  <div className="flex-row">
                    <input id="customEndCharInput" name="customEndCharInput" disabled={!shouldScrubCustomChar} size={1} onChange={handleCustomEndCharChange} value={customEndChar} />
                  </div>
                </div>
                <div className="flex-column flex-end-column padded-column">
                  <div className="flex-row">
                    <small>{`(Start and End characters must be unique)`}</small>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
      </div>
    </>
  );
};

export default CustomCharacterControl;
