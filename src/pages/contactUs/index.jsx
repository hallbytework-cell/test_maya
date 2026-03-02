import React, { useState, useEffect } from 'react';
import { 
    Phone, Mail, MapPin, Clock, Send, 
    Truck, Building2, MessageSquare, Gift, Loader2, AlertCircle 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { submitContactMessage } from '@/api/customer/conatct';
import { CONTACT_SUBJECTS } from '@/constants/constants';

const ContactUs = () => {
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '', 
        message: ''
    });

    const [touched, setTouched] = useState({});

    useEffect(() => {
        if (user) {
            setFormData(prevData => ({
                ...prevData,
                name: user.username|| '',
                email: user.email || '',
                phone: user.phoneNumber || '' 
            }));
        }
    }, [user]);

    const validate = (data) => {
        const errors = {};

        if (!data.name.trim()) {
            errors.name = "Name is required";
        }

        if (!data.phone.trim()) {
            errors.phone = "Phone number is required";
        } else if (!/^\d{10}$/.test(data.phone.replace(/\D/g, ''))) {
            errors.phone = "Please enter a valid 10-digit phone number";
        }

        if (!data.email.trim()) {
            errors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
            errors.email = "Please enter a valid email address";
        }

        if (!data.subject) {
            errors.subject = "Please select a subject";
        }


        if (!data.message.trim()) {
            errors.message = "Message is required";
        } else if (data.message.trim().length < 10) {
            errors.message = `Message must be at least 10 characters`;
        } else if (data.message.trim().length > 500) {
            errors.message = `Message cannot exceed 500 characters`;
        }

        return errors;
    };

    const errors = validate(formData);
    const isValid = Object.keys(errors).length === 0;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBlur = (e) => {
        setTouched({ ...touched, [e.target.name]: true });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isValid) return;

        setIsSubmitting(true);

        try {
            const payload = {
                ...formData,
                subject: formData.subject 
            };

            await submitContactMessage(payload);
            
            alert("Thanks for reaching out! We'll get back to you shortly.");
            
            setFormData({
                name: user ? (user.username || '') : '',
                email: user ? (user.email || '') : '',
                phone: user ? (user.phoneNumber || '') : '',
                subject: '',
                message: ''
            });
            setTouched({}); 

        } catch (error) {
            console.error("Contact submission error:", error);
            alert("Something went wrong. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <div className="bg-emerald-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                    <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#FFFFFF" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,79.6,-46.9C87.4,-34.7,90.1,-20.4,85.8,-8.1C81.5,4.2,70.2,14.5,60.7,23.8C51.2,33.1,43.5,41.4,34.7,48.6C25.9,55.8,16,61.9,4.8,63.5C-6.4,65.1,-18.9,62.2,-31.1,56.7C-43.3,51.2,-55.2,43.1,-64.8,32.3C-74.4,21.5,-81.7,8,-80.6,-5.1C-79.5,-18.2,-70,-30.9,-59.1,-40.8C-48.2,-50.7,-35.9,-57.8,-23.4,-66.1C-10.9,-74.4,1.8,-83.9,15.1,-83.6C28.4,-83.3,42.3,-73.2,44.7,-76.4Z" transform="translate(100 100)" />
                    </svg>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Let's Grow Together</h1>
                    <p className="text-emerald-100 text-lg md:text-xl max-w-2xl leading-relaxed">
                        Have a question about plant care, your order, or just want to say hi? 
                        We're here to help you create your perfect green space.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                     <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                            <Phone className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Call Us</h3>
                        <p className="text-gray-500 mb-1">Mon-Sat from 9am to 6pm</p>
                        <a href="tel:+919883796118" className="text-emerald-600 font-semibold hover:underline">+91 98837 96118</a>
                    </div>
                    
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                            <Mail className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Email Us</h3>
                        <p className="text-gray-500 mb-1">We'll reply within 24 hours</p>
                        <a href="mailto:care.mayavriksh@gmail.com" className="text-blue-600 font-semibold hover:underline">care.mayavriksh@gmail.com</a>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Visit Nursery</h3>
                        <p className="text-gray-500 mb-1">123 Green Avenue, Bangalore</p>
                        <a href="https://www.google.com/maps/place/MayaVriksh+Nursery/@23.0993239,88.4569428,17z/data=!3m1!4b1!4m6!3m5!1s0x39f8e9ef2cb3dfe1:0xb8874f47cff48557!8m2!3d23.099319!4d88.4595177!16s%2Fg%2F11yc_33j9p?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className="text-orange-600 font-semibold hover:underline">View on Map</a>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 mb-16">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <MessageSquare className="w-6 h-6 text-emerald-600" />
                                <h2 className="text-2xl font-bold text-gray-900">Send us a message</h2>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Your Name <span className="text-red-500">*</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                                                touched.name && errors.name 
                                                ? 'border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-500' 
                                                : 'border-gray-200 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500'
                                            }`}
                                            placeholder="John Doe"
                                        />
                                        {touched.name && errors.name && (
                                            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" /> {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <input 
                                            type="tel" 
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                                                touched.phone && errors.phone 
                                                ? 'border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-500' 
                                                : 'border-gray-200 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500'
                                            }`}
                                            placeholder="+91 98837 96118" 
                                        />
                                        {touched.phone && errors.phone && (
                                            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" /> {errors.phone}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                                            touched.email && errors.email 
                                            ? 'border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-500' 
                                            : 'border-gray-200 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500'
                                        }`}
                                        placeholder="john@example.com"
                                    />
                                    {touched.email && errors.email && (
                                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" /> {errors.email}
                                        </p>
                                    )}
                                </div>


                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject <span className="text-red-500">*</span>
                                    </label>
                                    <select 
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full px-4 py-3 rounded-xl border outline-none transition-all bg-white ${
                                            touched.subject && errors.subject 
                                            ? 'border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-500' 
                                            : 'border-gray-200 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500'
                                        }`}
                                    >
                                        <option value="">Select a topic</option>
                                        {Object.entries(CONTACT_SUBJECTS).map(([key, label]) => (
                                            <option key={key} value={key}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                    {touched.subject && errors.subject && (
                                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" /> {errors.subject}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Message <span className="text-red-500">*</span>
                                    </label>
                                    <textarea 
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        rows="4"
                                        maxLength={500} 
                                        className={`w-full px-4 py-3 rounded-xl border outline-none transition-all resize-none ${
                                            touched.message && errors.message 
                                            ? 'border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-500' 
                                            : 'border-gray-200 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500'
                                        }`}
                                        placeholder="How can we help you today?"
                                    ></textarea>
                                    {touched.message && errors.message ? (
                                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" /> {errors.message}
                                        </p>
                                    ) : (
                                        <p className={`mt-1 text-xs text-right ${formData.message.length >= 450 ? 'text-orange-500' : 'text-gray-400'}`}>
                                            {formData.message.length} / 500 characters
                                        </p>
                                    )}
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isSubmitting || !isValid}
                                    className={`w-full md:w-auto px-8 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 
                                        ${!isValid || isSubmitting 
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-70' 
                                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Send Message</span>
                                            <Send className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Clock className="w-5 h-5 text-emerald-600" />
                                <h3 className="font-bold text-gray-900">Operating Hours</h3>
                            </div>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li className="flex justify-between border-b border-gray-50 pb-2">
                                    <span>Monday - Friday</span>
                                    <span className="font-medium text-gray-900">9:00 AM - 7:00 PM</span>
                                </li>
                                <li className="flex justify-between border-b border-gray-50 pb-2">
                                    <span>Saturday</span>
                                    <span className="font-medium text-gray-900">10:00 AM - 6:00 PM</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Sunday</span>
                                    <span className="font-medium text-gray-900">Closed</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                            <h3 className="font-bold text-emerald-900 mb-2">Need quick answers?</h3>
                            <p className="text-sm text-emerald-700 mb-4">
                                Find answers to common questions about shipping, returns, and plant care in our FAQ section.
                            </p>
                            <Link to="/faq" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                                Visit FAQ Page <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bulk Order Section */}
                <div id="bulk-orders" className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl overflow-hidden shadow-sm border border-orange-100 mb-16">
                     <div className="grid md:grid-cols-2 items-center">
                        <div className="p-8 md:p-12">
                            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-6">
                                <Building2 className="w-3 h-3" />
                                <span>Corporate & Events</span>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Planning a Bulk Order?</h2>
                            <p className="text-gray-600 mb-8 text-lg">Whether it's corporate gifting, wedding favors, or office greening, we offer special pricing and customization for bulk orders.</p>
                            <div className="space-y-4 mb-8">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 p-1 bg-white rounded-full text-emerald-600 shadow-sm"><Truck className="w-4 h-4" /></div>
                                    <div><h4 className="font-bold text-gray-900">Pan-India Logistics</h4><p className="text-sm text-gray-500">Safe and secure delivery to multiple locations.</p></div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 p-1 bg-white rounded-full text-emerald-600 shadow-sm"><Gift className="w-4 h-4" /></div>
                                    <div><h4 className="font-bold text-gray-900">Custom Branding</h4><p className="text-sm text-gray-500">Add your company logo or custom messages to pots.</p></div>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <a href="tel:+919883796118" className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-lg shadow-gray-900/10">
                                    <Phone className="w-5 h-5" /><span>Call us for better price</span>
                                </a>
                                <a href="https://wa.me/919883796118" target="_blank" rel="noopener noreferrer" className="bg-white text-gray-900 border border-gray-200 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2">
                                    <span>Chat on WhatsApp</span>
                                </a>
                            </div>
                        </div>
                        <div className="h-full min-h-[300px] bg-gray-200 relative">
                            <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" alt="Office with plants" className="absolute inset-0 w-full h-full object-cover"/>
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-50/50 to-transparent md:from-amber-50 md:via-transparent"></div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ContactUs;