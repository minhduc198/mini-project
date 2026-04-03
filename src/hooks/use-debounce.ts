import { useEffect, useState } from "react";

export default function useDebounce<T>(value: T, delay: number) {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => {
      clearTimeout(timerId);
    };
  }, [value]);

  return debounceValue;
}
