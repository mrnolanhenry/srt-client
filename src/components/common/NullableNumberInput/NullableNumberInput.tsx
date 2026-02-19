interface NullableNumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  defaultValidNumber?: number;
  handleChangeCallback: (value: number | null) => void;
}

const NullableNumberInput = ({ defaultValidNumber, value, handleChangeCallback, ...props }: NullableNumberInputProps) => {
  const { onBlur } = {...props};

  const handleBlur = (event: any) => {
    // Don't override default blur behavior
    if (onBlur) {
      onBlur(event);
    }
    const valueIsInvalidNumber = typeof value !== 'number' || isNaN(Number(value as unknown as number));
    if (defaultValidNumber && valueIsInvalidNumber) {
      // on blur, set default value if current value is invalid.
      handleChangeCallback(defaultValidNumber);
    }
  }

  const handleChange = (event: any) => {
    const inputValue = event.target.value;

    // If the input is empty, set the state to null or undefined
    if (inputValue === '') {
      handleChangeCallback(null);
      return;
    }

    // Use built-in browser validation to check if it's a valid number
    // before attempting a numeric conversion (prevents issues with "e", "-", etc.)
    if (event.target.validity.valid) {
      handleChangeCallback(Number(inputValue));
    }
  };

  return (
    <>
      <input 
        type="number"  
        onBlur={handleBlur}
        onChange={handleChange}
        value={value ?? ''}
        {...props}
       />
    </>
  );
};

export default NullableNumberInput;
