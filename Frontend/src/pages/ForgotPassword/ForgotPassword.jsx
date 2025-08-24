import { useState } from "react";
import GetInput from "../../components/GetInput/GetInput";
import SubmitButton from "../../components/submitButton/submitbutton";
import NavBar from "../../components/HomeComp/NavBar/NavBar";
import { toast } from "react-toastify";

export default function ForgotPassword() {

  const API_URL = import.meta.env.VITE_API_URL;
  const [email, setEmail] = useState("");
  

  const role = localStorage.getItem("role");

  const handlesubmit = async (e) => {
    e.preventDefault();

    try {
      //console.log("starting to get to back");
      const response = await fetch(
        `${API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
          },
          body: email,
        },
      );

      if (!response.ok) {
        const errMsg = await response.text();
        toast.error(errMsg);
        return;
      }
      //console.log("res :",response);
      const data = await response.text();
      //console.log("data is :",data);

      toast.success(data);

      /*setTimeout(() => {
                navigate('/reset-password');
            }, 3000);     */ //3 sec
    } catch (e) {
      toast.error(`Something went wrong while sending Password Reset Link || ${e}`);
    }
  };

  return (
    <>
      <NavBar role={role} />
      <div className="forgot-container">
        <form onSubmit={handlesubmit}>
          <GetInput
            type="email"
            value={email}
            placeholder="Email"
            onChange={setEmail}
            required="required"
          />
          <br />
          <SubmitButton msg="Send Link" />
        </form>
      </div>
    </>
  );
}
