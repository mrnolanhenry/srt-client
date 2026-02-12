import { useState, useEffect } from 'react';

//useDebounce hook delays state updates until a specified amount of time has passed without the value changing. 
// This is useful for optimizing performance and preventing excessive re-renders in scenarios like user input or API calls.
const useDebounce = (value: any, delay: number) => {
  // State to store the debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer to update the debounced value after a delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function: Cancel the timer if the value changes again
    // or if the component unmounts
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]); // Only re-run the effect if value or delay changes

  return debouncedValue;
}

export default useDebounce;
