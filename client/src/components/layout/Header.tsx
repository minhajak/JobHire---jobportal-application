import type { NavigateFunction } from "react-router-dom";
import SearchBar from "../search/SearchBar";

const Header = ({
  profileImage,
  navigate,
}: {
  profileImage: string;
  navigate: NavigateFunction;
}) => {


  return (
    <header className="sticky top-0 z-50 w-full bg-white pt-9">
      <SearchBar
        navigate={navigate}
        profileImage={profileImage}
      />
    </header>
  );
};

export default Header;
