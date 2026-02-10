import { useState } from 'react';
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
  const [isCopied, setIsCopied] = useState(false);

  const COPY_CHARACTER = '\u{1F5D0}';

  const handleCopy = async () => {
    if (!navigator.clipboard) {
      console.warn('Clipboard API not supported');
      return false;
    }
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      // Reset the "Copied!" message after timeout
      setTimeout(() => setIsCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="flex-column full-width">
      <div className="flex-row copy-text-row">
        { isReadOnly ? (
          <textarea readOnly ref={scrollRef ?? null} id={id} className={`${className} copy-text-area`} name={id} rows={rows} cols={cols} onChange={onChange} onScroll={onScroll} value={value}></textarea>
        ) : (
          <textarea ref={scrollRef ?? null} id={id} className={`${className} copy-text-area`} name={id} rows={rows} cols={cols} onChange={onChange} onScroll={onScroll} value={value}></textarea>
        )}
        <div className="copy-text-button" onClick={handleCopy}>
          <span className="copy-text-span">
            <small className="copy-text-hover">
              {isCopied ? "" : 'Copy Text'}
            </small>
            {isCopied ? <small>Copied!</small> : ""}
            <span className="copy-text-character">{COPY_CHARACTER}</span>
          </span>
        </div>
        <CopyTextButton
          id="copyTextButton"
          value={value}
        />
      </div>
    </div>
  );
};

export default CopyTextArea;
