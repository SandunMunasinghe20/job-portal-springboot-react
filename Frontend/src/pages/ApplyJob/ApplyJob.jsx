import React from "react";
import SubmitButton from "../../components/submitButton/submitbutton";
import "./applyjob.css";



export default function ApplyJob(props){


    return (
        <div className="apply-job-card">

            <h2>{props.title}</h2>

            <p>{props.description}</p>

            <p>Salary: {props.salary}</p>
            <p>Location: {props.location}</p>
            <p>Company: {props.company}</p>
            <input type="file" />
            <SubmitButton msg="Apply" />
        </div>
    );
}