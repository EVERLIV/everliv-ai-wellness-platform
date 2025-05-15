
import React from "react";
import { AdminUser } from "@/services/admin-service";

interface UserAvatarProps {
  user: AdminUser;
}

const UserAvatar = ({ user }: UserAvatarProps) => {
  return (
    <div className="h-10 w-10 flex-shrink-0">
      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
        {user.first_name 
          ? user.first_name[0] 
          : (user.email ? user.email[0].toUpperCase() : "?")}
      </div>
    </div>
  );
};

export default UserAvatar;
