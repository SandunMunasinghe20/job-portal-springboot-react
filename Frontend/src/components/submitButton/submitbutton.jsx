import './submitButton.css'

export default function SubmitButton({msg,onClick}){
    return (
        <div className="Edit-profile-button">
        <button className="jl-btn jl-btn-primary" onClick={onClick}>{msg}</button>
        </div>
    );
}