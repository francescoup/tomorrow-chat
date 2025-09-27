import { useState } from "react";

export default function Avatar({
  src,
  name = "",
  size = "md", //sm | md | lg | xl
  rounded = "full",
  icon,
  className = "flex items-center justify-center rounded-full bg-gray-200",
  status = "offline", // opzionale: "online" | "away" | "busy" | "offline"
  //ring = false,
}) {
  const [error, setError] = useState(false);

  const sizes = {
    sm: { box: "w-8 h-8", text: "text-xs" },
    md: { box: "w-10 h-10", text: "text-sm" },
    lg: { box: "w-12 h-12", text: "text-base" },
  };

  const s = sizes[size] || sizes.md;

  const statusColorAvatar = {
    online: "bg-green-500",
    away: "bg-yellow-500",
    busy: "bg-red-500",
    offline: "bg-slate-400",
  };

  const statColor = statusColorAvatar[status] || statusColorAvatar.offline;

  const roundedSize = rounded === "xl" ? "rounded-2xl" : "rounded-full";

  function getInitials(name = "") {
    const words = name.split(" ").slice(0, 2);
    const initials = words.map((word) => word.charAt(0).toUpperCase()).join("");
    return initials || "AV";
  }

  const initials = getInitials(name);

  return (
    <>
      <div
        className={`overflow-hidden ${s.box} ${className} ${roundedSize}`}
        data-status={status}
      >
        {src && !error ? (
          <img
            src={src}
            alt={name || "AV"}
            className="w-full h-full object-contain"
            onError={() => setError(true)}
          />
        ) : name ? (
          <span className={`${s.text} ${roundedSize}`}>{initials}</span>
        ) : icon ? (
          <span className="text-gray-500 text-sm">{icon}</span>
        ) : null}
        {/* <span
          aria-hidden="true"
          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-white 
          ${statColor}`}
        >
          <i className="fa-solid fa-circle"></i>
        </span> */}
      </div>
    </>
  );
}
/* Ho modicato la classe dell'img per rendere il logo adattabile alle dimensioni del cerchietto:
 ho sostituito object-cover con object-contain */
