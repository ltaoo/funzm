/**
 * @file 音频播放
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { Howl, Howler } from "howler";

const SoundPlay = (props) => {
  const { src, children } = props;

  const [loading, setLoading] = useState(false);
  const timeRef = useRef(null);

  const play = useCallback(() => {
    if (loading) {
      return;
    }
    timeRef.current = setTimeout(() => {
      setLoading(true);
    }, 600);
    const sound = new Howl({
      src,
      html5: true,
    });
    sound.once("load", function () {
      if (timeRef.current) {
        clearTimeout(timeRef.current);
        return;
      }
      setLoading(false);
    });
    sound.play();
  }, [src, loading]);
  return <span onClick={play}>{loading ? "loading" : "voice"}</span>;
};

export default SoundPlay;
