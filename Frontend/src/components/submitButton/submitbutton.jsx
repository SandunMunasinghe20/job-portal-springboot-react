import './submitButton.css'

export default function SubmitButton({msg}){
    return (
        <div className='submit-button-component'>
            <button>{msg}</button>
        </div>
    );
}