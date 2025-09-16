const TextInput = ({ value, onChange, placeholder }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-2 text-[14px] outline-none border-none focus:outline-none focus:ring-0"
    />
  );
};

export default TextInput;
