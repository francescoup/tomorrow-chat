const TextInput = ({ value, onChange, onSend, placeholder }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // evita newline
      onSend(e);
    }
  };
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onKeyDown={handleKeyDown}
      className="w-full p-2 text-[14px] outline-none border-none focus:outline-none focus:ring-0"
    />
  );
};

export default TextInput;
