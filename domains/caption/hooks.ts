import { useCallback, useEffect, useState } from "react";

import { fetchCaptionProfileService, fetchCaptionsService } from "./services";
import { ICaptionValues } from "./types";

export function useCaptions() {
  const [loading, setLoading] = useState(true);
  const [captions, setCaptions] = useState<ICaptionValues[]>([]);

  const refresh = useCallback(async () => {
    setLoading(true);
    const nextCaptions = await fetchCaptionsService({ pageSize: 5 });
    setLoading(false);
    setCaptions(nextCaptions.list);
  }, []);

  useEffect(() => {
    refresh();
  }, []);

  return {
    dataSource: captions,
    loading,
  };
}

/**
 * 获取字幕详情
 * @param id
 * @returns
 */
export function useCaption(id) {
  const [caption, setCaption] = useState<null | ICaptionValues>(null);

  useEffect(() => {
    (async () => {
      const resp = await fetchCaptionProfileService({
        id,
      });

      setCaption(resp);
    })();
  }, [id]);

  return caption;
}
