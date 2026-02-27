import './CopyTextArea.css';
import CopyTextButton from '../CopyTextButton/CopyTextButton';
import CopyToInputButton from '../CopyToInputButton/CopyToInputButton';

interface CopyTextAreaProps {
  className: string;
  cols: number;
  id: string;
  isReadOnly?: boolean;
  rows: number;
  scrollRef?: React.RefObject<HTMLTextAreaElement>;
  value: string;
  handleCopyToInputCallback?: (value: string) => void;
  onChange: (event: any) => void;
  onScroll?: (event: any) => void;
}

const CopyTextArea = ({ className, cols, id, isReadOnly, rows, scrollRef, value, handleCopyToInputCallback, onChange, onScroll }: CopyTextAreaProps) => {
  return (
    <div className="flex-column full-width">
      <div className="flex-row copy-text-row">
        { isReadOnly ? (
          <textarea readOnly ref={scrollRef ?? null} id={id} className={`${className} copy-text-area`} name={id} rows={rows} cols={cols} onChange={onChange} onScroll={onScroll} value={value}></textarea>
        ) : (
          <textarea ref={scrollRef ?? null} id={id} className={`${className} copy-text-area`} name={id} rows={rows} cols={cols} onChange={onChange} onScroll={onScroll} value={value}></textarea>
        )}
        <div className="flex-row text-area-button-row">
          <div className="flex-column align-flex-end">
            <CopyTextButton
              id="copyTextButton"
              value={value}
            />
            { handleCopyToInputCallback ? (
              <CopyToInputButton
                id="copyToInputButton"
                value={value}
                handleCopyToInputCallback={handleCopyToInputCallback}
              /> 
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopyTextArea;
