import NavBar from '../../components/HomeComp/NavBar/NavBar';



export default function AdminHome() {

    const token = localStorage.getItem("auth-token");
    const role = localStorage.getItem("role");


    return (
        <>
            <NavBar role={role} />
        </>
    );

}