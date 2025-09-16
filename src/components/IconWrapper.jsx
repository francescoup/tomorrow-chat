export default function IconWrapper ({ onClick, icon, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`bg-transparent p-2 rounded-full hover:bg-blue-100 transition-colors duration-200 focux:outline-none ${className}`}
      type="button"
    > 
      <span className="text-gray-800 text-2xl">{icon}</span>
    </button>
  );
};