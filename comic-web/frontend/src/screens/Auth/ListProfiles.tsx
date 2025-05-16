// import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function UserProfiles(){
    const profiles = [1,2,3,4];
    return (
        <div>
            <h1>List Profiles</h1>
            
            {profiles.map((profile) => (
                <Link to={`/profiles/${profile}`} key={profile}>
                    <h2>Profile {profile}</h2>
                </Link>
            ))}
            <Outlet />
        </div>
    );
}