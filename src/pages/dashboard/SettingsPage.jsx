import { Bell, HelpCircle, Key, LogOut } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function SettingPage() {
    const navigate= useNavigate();
    return (
        <div className="space-y-6">
            {/* Account Settings */}
            <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                <div className="">
                    {/* <button className="flex items-center justify-between w-full py-3 text-left hover:bg-gray-50 rounded-lg px-2" data-testid="button-change-password">
                        <div className="flex items-center gap-3 text-gray-700">
                            <Key className="text-green-500" />
                            <span>Change Password</span>
                        </div>
                        <span className="text-gray-400 text-4xl">›</span>
                    </button> */}

                    {/* <button className="flex items-center justify-between w-full py-3 text-left hover:bg-gray-50 rounded-lg px-2" data-testid="button-notifications">
                        <div className="flex items-center gap-3 text-gray-700">
                            <Bell className="text-green-500" />
                            <span>Notification Preferences</span>
                        </div>
                        <span className="text-gray-400 text-4xl">›</span>
                    </button> */}

                    <button className="flex items-center justify-between w-full py-3 text-left hover:bg-gray-50 rounded-lg px-2 cursor-pointer" data-testid="button-help"
                        onClick={()=>navigate("../contact")}
                    >
                        <div className="flex items-center gap-3 text-gray-700">
                            <HelpCircle className="text-green-500" />
                            <span>Contact Us</span>
                        </div>
                        <span className="text-gray-400 text-4xl">›</span>
                    </button>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-red-600 mb-4">
                    Danger Zone
                </h2>
                <button className="flex items-center gap-3 text-red-600 hover:text-red-700 cursor-pointer" data-testid="button-signout">
                    <LogOut />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    )
}
