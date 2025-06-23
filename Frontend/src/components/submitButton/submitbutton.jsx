import './submitButton.css'

export default function SubmitButton({msg,onClick}){
    return (
        <div className='submit-button-component'>
            <button onClick={onClick}>{msg}</button>
        </div>
    );
}