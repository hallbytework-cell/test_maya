import { useAuth } from '@/context/AuthContext';
import React, { useEffect, useState } from 'react'

export default function Profile() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.fullName?.replace(user?.firstName, "").trim() || "",
        email: user?.email || "",
        phone: user?.phoneNumber || "",
        // address: "",
    });

    useEffect(()=>{
        if(profileData.firstName === ""){
            setIsEditing(true)
        }
    },[profileData])
    
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Profile Information</h3>
                {/* {isEditing ? (
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setIsEditing(false);
                            }}
                            className="flex items-center gap-1 px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
                            data-testid="button-save-profile"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => {
                                setIsEditing(false);
                            }}
                            className="flex items-center gap-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-400"
                            data-testid="button-cancel-edit"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        disabled={false}
                        className="flex items-center gap-1 px-4 py-2 bg-gray-200 text-white rounded-lg shadow hover:bg-gray-600  cursor-not-allowed"
                        data-testid="button-edit-profile"
                    >
                        <FileEdit /> Edit
                    </button>
                )} */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-gray-500">
                        First Name
                    </label>
                    <input
                        type="text"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleProfileChange}
                        readOnly={!isEditing}
                        className={`w-full mt-1 px-3 py-2 rounded-lg border ${isEditing
                            ? "bg-white border-green-500"
                            : "bg-gray-100 border-gray-200"
                            } focus:outline-none`}
                        data-testid="input-firstname"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-500">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleProfileChange}
                        readOnly={!isEditing}
                        className={`w-full mt-1 px-3 py-2 rounded-lg border ${isEditing
                            ? "bg-white border-green-500"
                            : "bg-gray-100 border-gray-200"
                            } focus:outline-none`}
                        data-testid="input-lastname"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-500">Email</label>
                    <input
                        type="text"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        readOnly={!isEditing}
                        className={`w-full mt-1 px-3 py-2 rounded-lg border ${isEditing
                            ? "bg-white border-green-500"
                            : "bg-gray-100 border-gray-200"
                            } focus:outline-none`}
                        data-testid="input-email"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-500">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        readOnly={!isEditing}
                        className={`w-full mt-1 px-3 py-2 rounded-lg border ${isEditing
                            ? "bg-white border-green-500"
                            : "bg-gray-100 border-gray-200"
                            } focus:outline-none`}
                        data-testid="input-phone"
                    />
                </div>
                {/* <div className="md:col-span-2">
                    <label className="block text-sm text-gray-500">Address</label>
                    <input
                        type="text"
                        name="address"
                        value={profileData.address}
                        onChange={handleProfileChange}
                        readOnly={!isEditing}
                        className={`w-full mt-1 px-3 py-2 rounded-lg border ${isEditing
                            ? "bg-white border-green-500"
                            : "bg-gray-100 border-gray-200"
                            } focus:outline-none`}
                        data-testid="input-address"
                    />
                </div> */}
            </div>
        </div>
    )
}
