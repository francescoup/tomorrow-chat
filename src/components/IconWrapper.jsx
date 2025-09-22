export default function IconWrapper({ onClick, icon, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`hover:bg-gray-200 dark:hover:bg-gray-700 p-3 rounded-full transition-colors duration-200 focux:outline-none ${className}`}
      type="button"
    >
      <span className="text-gray-800 dark:text-gray-100 ">{icon}</span>
    </button>
  );
}
