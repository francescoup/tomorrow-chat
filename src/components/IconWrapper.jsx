export default function IconWrapper({ onClick, icon, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`bg-gray-200 p-3 rounded-full hover:bg-gray-300 transition-colors duration-300 focux:outline-none ${className}`}
      type="button"
    >
      <span className="text-gray-800 text-sm">{icon}</span>
    </button>
  );
}
