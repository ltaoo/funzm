import { useRef, useState } from "react";

export function useVisible(
  defaultVisible: boolean = false
): [boolean, (event?: any) => void, (event?: any) => void] {
  const [visible, setVisible] = useState(defaultVisible);

  const showRef = useRef(() => {
    setVisible(true);
  });
  const hideRef = useRef(() => {
    setVisible(false);
  });
  return [visible, showRef.current, hideRef.current];
}
