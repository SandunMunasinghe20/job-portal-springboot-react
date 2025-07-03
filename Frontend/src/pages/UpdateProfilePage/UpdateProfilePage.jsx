import UpdateProfileComp from "../../components/UpdateProfileComp/UpdateProfileComp";
import NavBar from "../../components/HomeComp/NavBar/NavBar";


export default function UpdateProfilePage() {
    const role = localStorage.getItem("role");
    return (
        <><NavBar role={role} />
            <UpdateProfileComp />
        </>
    );

}