/**
 * @file 官网布局
 */
import SiteHeader from "./header";

const SiteLayout = (props) => {
  const { user, children } = props;

  return (
    <div className="relative bg-white overflow-hidden">
      <div className="mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:w-full lg:pb-28">
          <SiteHeader user={user} />
          {children}
        </div>
      </div>
    </div>
  );
};

export default SiteLayout;
