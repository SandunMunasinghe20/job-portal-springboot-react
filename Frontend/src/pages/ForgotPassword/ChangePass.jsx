import {  useState } from "react";
import GetInput from "../../components/GetInput/GetInput";
import SubmitButton from "../../components/submitButton/submitbutton";
import NavBar from "../../components/HomeComp/NavBar/NavBar";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ChangePass() {
  //const [err, toast.error] = useState("");
  // const [success, toast.success] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const resetToken = searchParams.get("token");

  const navigate = useNavigate();

  const role = null;

  const handlesubmit = async () => {
    if (!password || !confirmPassword) {
      toast.error("Please Fill Both Fields");
      return;
    }
    if (password != confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email,
            token: resetToken,
            password: password,
            confirmPassword: confirmPassword,
          }),
        },
      );

      const data = await response.text();
      if (!response.ok) {
        toast.error(data);
        return;
      }
      toast.success(data);

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      toast.error(`Error occured while Connecting with Server || ${error}`);
      return;
    }
  };

  return (
    <>
      <NavBar role={role} />
      <div className="forgot-container">
        <GetInput
          type="password"
          value={password}
          placeholder="Password"
          onChange={setPassword}
          required
        />
        <br />
        <GetInput
          type="password"
          value={confirmPassword}
          placeholder="Confirm Password"
          onChange={setConfirmPassword}
          required
        />
        <br />
        <SubmitButton msg="Change Password" onClick={handlesubmit} />
      </div>
    </>
  );
}
