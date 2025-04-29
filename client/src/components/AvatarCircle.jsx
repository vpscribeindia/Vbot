import React from "react";

const AvatarCircle = ({ name = "", photo }) => {
  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        className="w-10 h-10 rounded-full object-cover"
      />
    );
  }

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 1)
    .toUpperCase();

  return (
    <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white text-sm font-semibold uppercase">
      {initials || "👤"}
    </div>
  );
};

export default AvatarCircle;