import './EmailInput.css';

export default function EmailInput(props) {
  return (
    <div className="email-input-wrapper">
      <input
        type={props.type}
        value={props.value}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value)}
        required
      />
    </div>
  );
}
