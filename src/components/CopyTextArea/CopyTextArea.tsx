import { useState } from 'react';
import './CopyTextArea.css';
import CopyTextButton from '../CopyTextButton/CopyTextButton';
import { COPY_CHARACTER } from '../../constants/constants';

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
        <CopyTextButton
          id="copyTextButton"
          value={value}
        />
      </div>
    </div>
  );
};

export default CopyTextArea;
