import { useState } from 'react';
import './CopyTextButton.css';
import { COPY_CHAR } from '../../../constants/constants';

interface CopyTextButtonProps {
  id: string;
  value: string;
}

const CopyTextButton = ({ id, value }: CopyTextButtonProps) => {
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
    <div id={id} className="copy-text-button" onClick={handleCopy}>
      <span className="copy-text-span">
        <small className="copy-text-hover">
          {isCopied ? "" : 'Copy Text'}
        </small>
        {isCopied ? <small>Copied!</small> : ""}
        <span className="copy-text-character">{COPY_CHAR}</span>
      </span>
    </div>
  );
};

export default CopyTextButton;
