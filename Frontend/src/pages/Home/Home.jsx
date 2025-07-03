import React, { useEffect } from "react";

import NavBar from '../../components/HomeComp/NavBar/NavBar';
import Hero from "../../components/HomeComp/Hero/Hero";
import Features from "../../components/HomeComp/Features/Features";
import Footer from "../../components/HomeComp/Footer/Footer";

export default function Home() {

    const role = localStorage.getItem("role");

    return (
        <div>
            <NavBar role={role} />
            <Hero role={role} />
            <Features role={role} />
            <Footer role={role} />
        </div>

    );

}