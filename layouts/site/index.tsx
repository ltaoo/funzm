/**
 * @file 官网布局
 */
import SiteHeader from "./header";
import Footer from "./footer";

const SiteLayout = (props) => {
  const { user, children } = props;

  return (
    <div className="relative bg-white overflow-hidden">
      <div className="mx-auto">
        <div className="relative z-10 bg-whitelg:w-full">
          <SiteHeader user={user} />
          <div className="bg-gray-100 pb-16 md:pb-28">
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SiteLayout;
