import { useState } from 'react';
import './CopyToInputButton.css';
import { ARROW_HOOK_LEFT_CHAR } from '../../../constants/constants';

interface CopyToInputButtonProps {
  id: string;
  value: string;
  handleCopyToInputCallback: (value: string)  => void;
}

// TODO: Create lower order component to use for this and CopyTextButton and maybe rename this Paste In Input
const CopyToInputButton = ({ id, value, handleCopyToInputCallback }: CopyToInputButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyToInput = async () => {
    handleCopyToInputCallback(value);
    setIsCopied(true);
    // Reset the "Copied!" message after timeout
    setTimeout(() => setIsCopied(false), 1500);
  };

  return (
    <div id={id} className="copy-to-input-button" onClick={handleCopyToInput}>
      <span className="copy-to-input-span">
        <small className="copy-to-input-hover">
          {isCopied ? "" : 'Copy Text Over To Input'}
        </small>
        {isCopied ? <small>Copied over to Input Subs!</small> : ""}
        <span className="copy-to-input-character"> {ARROW_HOOK_LEFT_CHAR} </span>
      </span>
    </div>
  );
};

export default CopyToInputButton;
