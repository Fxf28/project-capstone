"use client";
import React from "react";
import { UserProfile } from "@clerk/nextjs";

function Profile() {
    return (
        <div className="flex justify-center items-center p-4">
            <UserProfile routing="hash" />
        </div>
    );
}

export default Profile;
