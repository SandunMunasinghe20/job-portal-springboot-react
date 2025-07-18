
export default function GetInput(props) {
  return (
    <input
      type={props.type}
      value={props.value}
      min={props.min}
      placeholder={props.placeholder}
      onChange={(e) => props.onChange(e.target.value)}
      required={props.required}
      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
    />
  );
}
