import './CopyTextArea.css';
import CopyTextButton from '../CopyTextButton/CopyTextButton';

interface CopyTextAreaProps {
  className: string;
  cols: number;
  id: string;
  isReadOnly?: boolean;
  rows: number;
  scrollRef?: React.RefObject<HTMLTextAreaElement>;
  value: string;
  onChange: (event: any) => void;
  onScroll?: (event: any) => void;
}

const CopyTextArea = ({ className, cols, id, isReadOnly, rows, scrollRef, value, onChange, onScroll }: CopyTextAreaProps) => {
  return (
    <div className="flex-column full-width">
      <div className="flex-row copy-text-row">
        { isReadOnly ? (
          <textarea readOnly ref={scrollRef ?? null} id={id} className={`${className} copy-text-area`} name={id} rows={rows} cols={cols} onChange={onChange} onScroll={onScroll} value={value}></textarea>
        ) : (
          <textarea ref={scrollRef ?? null} id={id} className={`${className} copy-text-area`} name={id} rows={rows} cols={cols} onChange={onChange} onScroll={onScroll} value={value}></textarea>
        )}
        <CopyTextButton
          id="copyTextButton"
          value={value}
        />
      </div>
    </div>
  );
};

export default CopyTextArea;
