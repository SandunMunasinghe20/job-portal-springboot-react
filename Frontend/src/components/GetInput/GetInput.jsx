export default function GetInput(props) {
  const { type, value, onChange, placeholder, required, min } = props;
  
  //for job description
  if (type === "textarea") {
    return (
      <textarea
        className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        rows={6} // adjust height
      ></textarea>
    );
  }
  
  
  
  return (
    <input
      type={props.type}
      value={props.value}
      min={props.min}
      placeholder={props.placeholder}
      onChange={(e) => props.onChange(e.target.value)}
      required={props.required}
      className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white"
    />
  );
}
