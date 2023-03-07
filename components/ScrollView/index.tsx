/**
 * @file 加载更多容器
 */
import { useEffect, useRef } from "react";
import cx from "classnames";
import debounce from "lodash.debounce";

interface IProps {
  className?: string;
  loading?: boolean;
  noMore?: boolean;
  children?: React.ReactNode;
  onLoadMore?: () => void;
}
const ScrollView: React.FC<IProps> = (props) => {
  const { className, noMore = false, children, onLoadMore } = props;

  const onLoadMoreRef = useRef(onLoadMore);
  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    const handler = debounce(async () => {
      if (
        document.documentElement.scrollTop +
          document.documentElement.clientHeight +
          200 >=
        document.body.clientHeight
      ) {
        if (onLoadMoreRef.current) {
          onLoadMoreRef.current();
        }
      }
    }, 400);

    document.addEventListener("scroll", handler);
    return () => {
      document.removeEventListener("scroll", handler);
    };
  }, []);

  return (
    <div className={cx(className)}>
      {children}
      {!noMore && (
        <div className="my-6 text-gray-300 text-center">加载中...</div>
      )}
      {noMore && (
        <div className="my-6 text-gray-300 text-center">没有更多了~</div>
      )}
    </div>
  );
};

export default ScrollView;
