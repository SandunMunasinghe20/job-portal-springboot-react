import  { useEffect } from "react";

export default function GoogleLoginButton({ onLoginSuccess, onLoginError }) {
  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID",
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        {
          theme: "outline",
          size: "large",
          width: "100%",
        },
      );

      window.google.accounts.id.prompt();
    }

    function handleCredentialResponse(response) {
      if (response.credential) {
        onLoginSuccess(response.credential);
      } else {
        onLoginError("Google sign-in failed");
      }
    }
  }, [onLoginSuccess, onLoginError]);

  return <div id="googleSignInDiv" style={{ width: "100%" }}></div>;
}
