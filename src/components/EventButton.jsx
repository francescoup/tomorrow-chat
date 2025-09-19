export default function EventButton({
  onClick,
  disabled = false,
  children, // es SEND
  icon = null, //es: <i className="fa-solid fa-paper-plane" />

  size = "md", // "sm" | "md" | "lg"
  type = "button",

  className = "",
}) {
  const sizes = {
    sm: { btn: "h-9 px-3 text-sm", icon: "text-[14px]" },
    md: { btn: "h-10 px-3.5 text-sm", icon: "text-[16px]" },
    lg: { btn: "h-11 px-4 text-sm", icon: "text-[18px]" },
  };

  const s = sizes[size] || sizes.md;

  // grafica di base che sfrutta className per settaggi futuri
  const base = `inline-flex items-center justify-center gap-2 rounded-full w-full px-4 py-2.5 font-semibold 
  dark:text-blue-800
  dark:bg-[#6699d8ff]
  dark:hover:bg-[#4283D4]
  transition disabled:opacity-60 disabled:cursor-not-allowed
  ${s.btn} 
  ${className}`;

  return (
    <div>
      <button
        type={type}
        className={base}
        onClick={onClick}
        disabled={disabled}
      >
        {children} {icon && <span className="mr-2 ml-2 text-2xl">{icon}</span>}
      </button>
    </div>
  );
}
