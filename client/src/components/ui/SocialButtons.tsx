import { FaApple, FaFacebookF } from "react-icons/fa";
import { Link } from "react-router-dom";

const SocialButtons = ({
  google,
  facebook,
  appleId,
}: {
  google: string;
  facebook: string;
  appleId: string;
}) => {
  return (
    <div className="flex justify-center gap-14">
      <div className="flex flex-col items-center">
        <Link
          to={google}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-100"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-6 h-6"
          />
        </Link>
        <span className="mt-2 text-sm">Google</span>
      </div>
      <div className="flex flex-col items-center">
        <Link
          to={facebook}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-100"
        >
          <FaFacebookF className="text-blue-600 text-icon" />
        </Link>
        <span className="mt-2 text-sm">Facebook</span>
      </div>
      <div className="flex flex-col items-center">
        <Link
          to={appleId}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-100"
        >
          <FaApple className="text-black text-icon" />
        </Link>
        <span className="mt-2 text-sm">Apple ID</span>
      </div>
    </div>
  );
};

export default SocialButtons;
