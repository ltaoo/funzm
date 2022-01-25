import { useEffect, useState, useRef, useCallback } from "react";
import Helper, { InitialOptions, Response } from "@list/core";

import { shallowEqual } from "./util";

function useHelper<T>(
  fetch: Function,
  options?: InitialOptions
): [Response<T>, Helper<T>] {
  const helperRef = useRef(new Helper<T>(fetch, options));
  const responseRef = useRef(helperRef.current.response);
  const [count, setCount] = useState(0);

  const forceUpdate = useCallback(() => {
    setCount((prev) => prev + 1);
  }, [count]);

  useEffect(() => {
    const helper = helperRef.current;
    helper.onChange = (response: Response<T>) => {
      if (!shallowEqual(responseRef.current, response)) {
        responseRef.current = response;
        forceUpdate();
      }
    };
  }, []);

  return [{ ...responseRef.current }, helperRef.current];
}

export default useHelper;

// export * from "list-helper-core";
