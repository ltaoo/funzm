import { useEffect, useRef } from "react";
import cx from "classnames";

function longerText(a, b) {
  if (a && b) {
    const aL = a.length;
    const bL = b.length;
    if (aL > bL) {
      return a;
    }
    return b;
  }
  if (a) {
    return a;
  }
  return b;
}

const GraphCanvas = (props) => {
  const { times } = props;
  const $canvasRef = useRef(null);

  useEffect(() => {
    if ($canvasRef.current === null) {
      return;
    }
    const ctx = $canvasRef.current.getContext("2d");
  }, []);

  console.log(times);
  const hasCompleted = times.find((t) => t.type === "completed");

  //   return <canvas ref={$canvasRef} />;
  return (
    <div className="relative mb-4 pr-12 bg-gray-50 py-5 px-2 rounded">
      <div className="relative z-index-2 flex ">
        {times.map((time, i) => {
          const { type, top, text, under } = time;
          return (
            <div key={i} className={cx("relative text-center", times.length === 1 ? "ml-[50%]" : "ml-12" )}>
              {(() => {
                if (type === "completed") {
                  return (
                    <div className="#top relative">
                      <p
                        className={cx(
                          "relative -left-14 leading-4 border-t-2 border-r-2 border-gray-300"
                        )}
                      >
                        <pre>{top}</pre>
                      </p>
                      <div className="absolute right-10.5 -bottom-2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-transparent border-t-gray-300 transform -translate-x-2/4" />
                    </div>
                  );
                }
                if (top) {
                  return (
                    <div className={cx("#top")}>
                      {top}
                      {hasCompleted && (
                        <div className="invisible">
                          <p
                            className={cx(
                              "relative -left-14 leading-4 border-t-2 border-r-2 border-gray-500"
                            )}
                          >
                            <pre>{hasCompleted.top}</pre>
                          </p>
                          <div className="absolute left-17.5 top-0 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-transparent border-t-gray-500 transform -translate-x-2/4" />
                        </div>
                      )}
                    </div>
                  );
                }
                if (hasCompleted) {
                  return (
                    <div className="#top invisible">
                      <p
                        className={cx(
                          "relative -left-14 leading-4 border-t-2 border-r-2 border-gray-500"
                        )}
                      >
                        <pre>{hasCompleted.top}</pre>
                      </p>
                      <div className="absolute left-17.5 top-0 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-transparent border-t-gray-500 transform -translate-x-2/4" />
                    </div>
                  );
                }
                return <div className="#top">&nbsp;</div>;
              })()}
              {(() => {
                if (type === "simple") {
                  return (
                    <p className="#middle relative">
                      (<span className="absolute left-[44%]">{text}</span>
                      <span className="invisible">
                        {longerText(top, under)}
                      </span>
                      )
                    </p>
                  );
                }
                if (text) {
                  return <p className="#middle">{text}</p>;
                }
                return <p className="#middle">&nbsp;</p>;
              })()}
              <p className="#bottom mt-2">{under}</p>
            </div>
          );
        })}
      </div>
      <div className="absolute z-index-1 left-4 w-[90%] bottom-15.5 border border-gray-300 border-t-1"></div>
      <div className="absolute left-[92%] bottom-14 w-0 h-0 border-t-[8px] border-b-[8px] border-l-[8px] border-transparent border-l-gray-300 transform -translate-x-2/4" />
    </div>
  );
};

export default GraphCanvas;
