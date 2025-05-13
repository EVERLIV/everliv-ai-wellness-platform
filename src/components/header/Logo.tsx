
import React from "react";
import { Link } from "react-router-dom";

const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center text-lg font-semibold gap-2">
      <img src="/lovable-uploads/1d550229-884d-4912-81bb-d9b77b6f44bf.png" alt="EVERLIV Logo" className="h-8 w-auto" />
      EVERLIV
    </Link>
  );
};

export default Logo;
