import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import {
    Plus, Pencil, Trash2, Home, Building2, LocateFixed,
    Loader2, MapPin, User, Phone, Map, Navigation, CheckCircle2, X
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";


import {
    addCustomerAddress,
    deleteCustomerAddress,
    getCustomerAddresses,
    updateCustomerAddress
} from "@/api/customer/address";
import { getBrowserLocation } from "@/lib/geolocation";
import { getLocationDetails } from "@/lib/pincodeExtraction";
import AddressCard from '@/components/cards/AddressCard';


const mapApiToUi = (data) => {
    if (!Array.isArray(data)) return [];

    return data.map(addr => {
        const details = addr.address || {};

        return {
            id: addr.addressId,
            type: addr.addressType,
            name: addr.addresseeName,
            phone: addr.addresseePhoneNumber,
            street: details.STREET_ADDRESS || details.streetAddress || '',
            landmark: details.LANDMARK || details.landmark || '',
            city: details.CITY || details.city || '',
            state: details.STATE || details.state || '',
            zip: details.PIN_CODE || details.pinCode || '',
            isDefault: addr.isDefault,
            latitude: details.LATITUDE || details.latitude,
            longitude: details.LONGITUDE || details.longitude
        };
    });
};


const mapUiToApiPayload = (formData, existingAddresses) => {
    const isNewAddress = !formData.id;
    return {
        "addresseeName": formData.name,
        "addresseePhoneNumber": formData.phone,
        "addressType": formData.type,
        "deliveryInstruction": "",
        "isDefault": formData.isDefault || (isNewAddress && existingAddresses.length === 0),
        "address": {
            "streetAddress": formData.street,
            "city": formData.city,
            "state": formData.state,
            "country": "India",
            "pinCode": formData.zip,
            "landmark": formData.landmark,
            "latitude": formData.latitude?.toString() || "",
            "longitude": formData.longitude?.toString() || ""
        }
    };
};


const AddressShimmer = () => (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse relative overflow-hidden">
        <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 shrink-0"></div>
            <div className="flex-1 space-y-3 min-w-0">
                <div className="flex justify-between items-center">
                    <div className="h-5 bg-slate-200 rounded w-24"></div>
                    <div className="flex gap-2">
                        <div className="w-8 h-8 bg-slate-50 rounded-full"></div>
                        <div className="w-8 h-8 bg-slate-50 rounded-full"></div>
                    </div>
                </div>
                <div className="h-4 bg-slate-100 rounded w-32"></div>
                <div className="space-y-2 pt-2">
                    <div className="h-3 bg-slate-50 rounded w-full"></div>
                    <div className="h-3 bg-slate-50 rounded w-5/6"></div>
                </div>
                <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-50">
                    <div className="h-6 bg-slate-100 rounded w-20"></div>
                </div>
            </div>
        </div>
    </div>
);


const AddressFormModal = ({ isOpen, onClose, onSave, initialData, isSaving }) => {
    const [isLocating, setIsLocating] = useState(false);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            id: initialData?.id || null,
            type: initialData?.type || 'Home',
            name: initialData?.name || '',
            street: initialData?.street || '',
            landmark: initialData?.landmark || '',
            city: initialData?.city || '',
            state: initialData?.state || '',
            zip: initialData?.zip || '',
            phone: initialData?.phone || '',
            isDefault: initialData?.isDefault || false,
            latitude: initialData?.latitude || '',
            longitude: initialData?.longitude || ''
        }
    });

    const currentType = watch("type");

    if (!isOpen) return null;

    const handleRequestLocation = async () => {
        setIsLocating(true);
        try {
            const coords = await getBrowserLocation();
            // setValue("latitude", coords.latitude);
            // setValue("longitude", coords.longitude);
            // const loc = await getLocationDetails(coords.latitude, coords.longitude);
            // if (loc.address || loc.displayName) setValue("street", loc.displayName.split(',')[0] || loc.address || "");
            // if (loc.city) setValue("city", loc.city);
            // if (loc.state) setValue("state", loc.state);
            // if (loc.pincode) setValue("zip", loc.pincode);

            toast.success("Location details captured!", {
                icon: '📍',
                style: { background: '#10b981', color: '#fff' }
            });
        } catch (error) {
            console.error(error);
            toast.error("Could not fetch location.", {
                style: { background: '#ef4444', color: '#fff' }
            });
        } finally {
            setIsLocating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 ">
            <div className="bg-white w-full max-w-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300">

                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white sm:rounded-t-3xl sticky top-0 z-10">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 tracking-tight  cursor-pointer">
                            {initialData ? 'Edit Address' : 'Add New Address'}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">Delivery details for your order</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 hover:text-rose-500 transition-colors text-slate-400  cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200">
                    <form onSubmit={handleSubmit(onSave)} className="space-y-6">

                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Type of Place</label>
                            <div className="grid grid-cols-2 gap-4">
                                {['Home', 'Office'].map((type) => (
                                    <label
                                        key={type}
                                        className={`
                                            relative cursor-pointer border rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all duration-200
                                            ${currentType === type
                                                ? (type === 'Home'
                                                    ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 ring-1 ring-indigo-500 shadow-sm'
                                                    : 'border-orange-500 bg-orange-50/50 text-orange-700 ring-1 ring-orange-500 shadow-sm')
                                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600'
                                            }
                                        `}
                                    >
                                        <input type="radio" value={type} {...register("type")} className="hidden" />
                                        {type === 'Home' ? <Home size={24} strokeWidth={2} /> : <Building2 size={24} strokeWidth={2} />}
                                        <span className="font-bold text-sm">{type}</span>
                                        {currentType === type && (
                                            <div className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full ${type === 'Home' ? 'bg-indigo-500' : 'bg-orange-500'}`} />
                                        )}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-3.5 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                    <input
                                        {...register("name", { required: "Name is required" })}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-300 text-slate-700 bg-slate-50/30 focus:bg-white"
                                        placeholder="e.g. John Doe"
                                    />
                                </div>
                                {errors.name && <p className="text-xs text-rose-500 font-medium ml-1">{errors.name.message}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700">Mobile Number</label>
                                <div className="relative group">
                                    <Phone className="absolute left-3.5 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                    <input
                                        type="tel"
                                        {...register("phone", {
                                            required: "Phone is required",
                                            pattern: { value: /^\d{10}$/, message: "Must be 10 digits" }
                                        })}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-300 text-slate-700 bg-slate-50/30 focus:bg-white"
                                        placeholder="e.g. 9876543210"
                                    />
                                </div>
                                {errors.phone && <p className="text-xs text-rose-500 font-medium ml-1">{errors.phone.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <Map size={16} className="text-indigo-500" />
                                    Address Details
                                </label>
                                {/* <button
                                    type="button"
                                    onClick={handleRequestLocation}
                                    disabled={isLocating}
                                    className="text-xs font-bold text-white bg-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-slate-700 transition-colors shadow-sm disabled:opacity-70 active:scale-95"
                                >
                                    {isLocating ? <Loader2 size={12} className="animate-spin" /> : <LocateFixed size={12} />}
                                    {isLocating ? 'Detecting...' : 'Use My Location'}
                                </button> */}
                            </div>

                            <div className="space-y-3">
                                <textarea
                                    {...register("street", { required: "Street address is required" })}
                                    rows="2"
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm resize-none bg-white placeholder:text-slate-300 text-slate-700"
                                    placeholder="House No, Floor, Building, Street Name..."
                                ></textarea>
                                {errors.street && <p className="text-xs text-rose-500 font-medium">{errors.street.message}</p>}

                                <input
                                    {...register("landmark")}
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm bg-white placeholder:text-slate-300 text-slate-700"
                                    placeholder="Landmark (Optional)"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 ml-1">City</label>
                                <input
                                    {...register("city", { required: true })}
                                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none bg-slate-50/50 focus:bg-white text-sm font-medium text-slate-700"
                                    placeholder="City"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 ml-1">State</label>
                                <input
                                    {...register("state", { required: true })}
                                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none bg-slate-50/50 focus:bg-white text-sm font-medium text-slate-700"
                                    placeholder="State"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 ml-1">Pincode</label>
                                <input
                                    {...register("zip", { required: true, pattern: /^\d{6}$/ })}
                                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none bg-slate-50/50 focus:bg-white text-sm font-medium text-slate-700"
                                    placeholder="000000"
                                />
                            </div>
                        </div>

                        <div className="pt-6 flex gap-3 sticky bottom-0 bg-white pb-2 z-10">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors  cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="flex-[2] py-3.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all disabled:opacity-70 flex justify-center items-center gap-2 active:scale-[0.98]  cursor-pointer"
                            >
                                {isSaving && <Loader2 size={18} className="animate-spin" />}
                                {initialData ? 'Update Address' : 'Save & Deliver Here'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};


export default function AddressTab() {
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const queryClient = useQueryClient();

    // 1. Fetch Addresses
    const { data: addresses = [], isLoading } = useQuery({
        queryKey: ["user-address"],
        queryFn: async () => {
            const resp = await getCustomerAddresses();
            return resp.data || [];
        },
        select: (data) => mapApiToUi(data),
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: "always",
    });

    // 2. Set Default Mutation
    const setDefaultMutation = useMutation({
        mutationFn: async (addressId) => {
            const addressToSetDefault = addresses.find(addr => addr.id === addressId);
            if (!addressToSetDefault) throw new Error("Address not found.");

            const payload = mapUiToApiPayload({ ...addressToSetDefault, isDefault: true }, addresses);

            return await updateCustomerAddress(addressId, payload);
        },
        onSuccess: () => {
            toast.success("Default address updated! ⭐", {
                style: { borderRadius: '12px', background: '#059669', color: '#fff' },
            });
            queryClient.invalidateQueries(["user-address"]);
        },
        onError: () => toast.error("Failed to set default address.")
    });

    // 3. Save/Update Mutation
    const saveAddressMutation = useMutation({
        mutationFn: async (formData) => {
            const payload = mapUiToApiPayload(formData, addresses);
            if (formData.id) return await updateCustomerAddress(formData.id, payload);
            return await addCustomerAddress(payload);
        },
        onSuccess: (data, variables) => {
            const isEdit = !!variables.id;
            toast.success(isEdit ? "Address updated!" : "New location added!");
            queryClient.invalidateQueries(["user-address"]);
            setShowAddressModal(false);
        },
        onError: () => toast.error("Failed to save address.")
    });

    // 4. Delete Mutation
    const deleteAddressMutation = useMutation({
        mutationFn: async (id) => await deleteCustomerAddress(id),
        onSuccess: () => {
            toast.success("Address removed.");
            queryClient.invalidateQueries(["user-address"]);
        },
        onError: () => toast.error("Failed to remove address.")
    });

    // Handlers
    const handleAddNew = () => { setEditingAddress(null); setShowAddressModal(true); };
    const handleEdit = (address) => { setEditingAddress(address); setShowAddressModal(true); };
    const handleDelete = (id) => { if (window.confirm("Remove this address?")) deleteAddressMutation.mutate(id); };
    const handleSaveAddress = (formData) => saveAddressMutation.mutate(formData);

    if (isLoading) return <div className="p-10"><AddressShimmer /></div>;

    return (
        <div className="space-y-8 max-w-5xl mx-auto p-4 sm:p-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Saved Addresses</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage delivery locations</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all"
                >
                    <Plus size={18} />
                    <span className="font-semibold text-sm">Add New Address</span>
                </button>
            </div>

            {addresses.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <Navigation size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-slate-800 font-bold">No addresses yet</h3>
                    <button onClick={handleAddNew} className="text-indigo-600 font-bold mt-2">Add your first address</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((addr) => (
                        <AddressCard
                            key={addr.id}
                            address={addr}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onSetDefault={(id) => setDefaultMutation.mutate(id)}
                            isSettingDefault={setDefaultMutation.isPending && setDefaultMutation.variables === addr.id}
                            isDeleting={deleteAddressMutation.isPending && deleteAddressMutation.variables === addr.id}
                        />
                    ))}
                </div>
            )}

            {showAddressModal && (
                <AddressFormModal
                    isOpen={showAddressModal}
                    onClose={() => setShowAddressModal(false)}
                    onSave={handleSaveAddress}
                    initialData={editingAddress}
                    isSaving={saveAddressMutation.isPending}
                />
            )}
        </div>
    );
}