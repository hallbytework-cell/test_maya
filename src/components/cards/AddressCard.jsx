import React from "react";
import { 
  Home, 
  Building2, 
  Pencil, 
  Trash2, 
  Phone, 
  CheckCircle2, 
  Loader2, 
  Star 
} from "lucide-react";

const AddressCard = ({ 
  address, 
  onEdit, 
  onDelete, 
  isDeleting, 
  onSetDefault, 
  isSettingDefault 
}) => {
  const isHome = address.type?.toLowerCase() === 'home';
  const isDefault = address.isDefault;

  return (
    <div className={`
      relative overflow-hidden rounded-2xl p-6 transition-all duration-300
      ${isDefault 
        ? 'bg-white border-2 border-emerald-500 shadow-lg shadow-emerald-50' 
        : 'bg-slate-50/50 border border-slate-100 hover:bg-white hover:border-emerald-200'
      }
    `}>
      
      {/* Header: Type and Actions */}
      <div className="flex justify-between items-start mb-4">
        <div className={`
          flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-tight
          ${isDefault ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'}
        `}>
          {isDefault ? <CheckCircle2 size={12} /> : null}
          {isDefault ? 'Default' : address.type}
        </div>

        <div className="flex gap-1">
          {/* Set Default Button (Only for non-default addresses) */}
          {!isDefault && (
            <button 
              onClick={() => onSetDefault(address.id)}
              disabled={isSettingDefault || isDeleting}
              className="p-2 text-slate-400 hover:text-amber-500 transition-colors disabled:opacity-50"
              title="Make Default"
            >
              {isSettingDefault ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Star size={18} />
              )}
            </button>
          )}

          <button 
            onClick={() => onEdit(address)} 
            disabled={isSettingDefault || isDeleting}
            className="p-2 text-slate-400 hover:text-emerald-600 transition-colors disabled:opacity-50"
          >
            <Pencil size={18} />
          </button>
          
          {!isDefault && (
            <button 
              onClick={() => onDelete(address.id)} 
              disabled={isDeleting || isSettingDefault} 
              className="p-2 text-slate-400 hover:text-rose-500 disabled:opacity-50"
            >
              {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
            </button>
          )}
        </div>
      </div>

      {/* Main Info */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
          {isHome ? (
            <Home className="text-emerald-500" size={24} />
          ) : (
            <Building2 className="text-orange-500" size={24} />
          )}
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-lg leading-tight">{address.name}</h3>
          {!isDefault && !isSettingDefault && (
             <button 
               onClick={() => onSetDefault(address.id)}
               className="text-xs text-emerald-600 font-semibold hover:underline mt-1"
             >
               Set as default
             </button>
          )}
          {isSettingDefault && (
            <p className="text-xs text-slate-400 animate-pulse mt-1 font-medium">Updating...</p>
          )}
        </div>
      </div>

      <div className="space-y-1 text-slate-600 text-sm mb-5">
        <p className="font-medium text-slate-800">{address.street}</p>
        <p>{address.city}, {address.state} - <span className="text-slate-400">{address.zip}</span></p>
      </div>

      {/* Contact Footer */}
      <div className="flex items-center gap-4 pt-4 border-t border-slate-100 text-slate-500">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <Phone size={14} className="text-emerald-500" />
          {address.phone}
        </div>
      </div>
    </div>
  );
};

export default AddressCard;