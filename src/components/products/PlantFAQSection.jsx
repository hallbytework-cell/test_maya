import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus, Minus, MessageSquare, ChevronRight, X } from "lucide-react";
import { getPlantFAQs } from "@/api/customer/plant";

const FAQ_CONFIG = {
  INITIAL_DISPLAY_LIMIT: 3,
  API_FETCH_LIMIT: 50,
  STALE_TIME: 1000 * 60 * 10,
  ANIMATION_DURATION: "duration-500",
  MODAL_Z_INDEX: "z-[100]",
  TEXT: {
    MODAL_CLOSE: "Back to Product",
    SHOW_MORE_PREFIX: "+",
    SHOW_MORE_SUFFIX: "More Questions",
    VIEW_ALL: "View All"
  }
};

export default function PlantFAQSection({ plantId, plantName }) {
  const [openId, setOpenId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: faqResponse, isLoading, isError } = useQuery({
    queryKey: ["plantFAQs", plantId],
    queryFn: () => getPlantFAQs(plantId, { limit: FAQ_CONFIG.API_FETCH_LIMIT }),
    enabled: !!plantId,
    staleTime: FAQ_CONFIG.STALE_TIME,
  });

  const allFaqs = faqResponse?.data || [];
  const initialFaqs = allFaqs.slice(0, FAQ_CONFIG.INITIAL_DISPLAY_LIMIT);
  const hasMore = allFaqs.length > FAQ_CONFIG.INITIAL_DISPLAY_LIMIT;
  const remainingCount = allFaqs.length - FAQ_CONFIG.INITIAL_DISPLAY_LIMIT;

  if (isLoading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="animate-spin text-indigo-600 w-10 h-10" />
    </div>
  );
  
  if (isError || allFaqs.length === 0) return null;

  return (
    <section className="my-5 lg:my-10 mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-5 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Expert Q&A</h2>
          <p className="text-slate-600 mt-2">The most common questions about {plantName}.</p>
        </div>
        {hasMore && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors group"
          >
            {FAQ_CONFIG.TEXT.VIEW_ALL} {allFaqs.length} Questions 
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {initialFaqs.map((faq) => (
          <FAQItem 
            key={faq.plantFaqId} 
            faq={faq} 
            isOpen={openId === faq.plantFaqId} 
            toggle={() => setOpenId(openId === faq.plantFaqId ? null : faq.plantFaqId)} 
          />
        ))}
      </div>

      {hasMore && (
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full mt-6 py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 font-bold hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all"
        >
          {FAQ_CONFIG.TEXT.SHOW_MORE_PREFIX} {remainingCount} {FAQ_CONFIG.TEXT.SHOW_MORE_SUFFIX}
        </button>
      )}

      {isModalOpen && (
        <div className={`fixed inset-0 ${FAQ_CONFIG.MODAL_Z_INDEX} flex items-end md:items-center justify-center p-0 md:p-6 animate-in fade-in duration-300`}>
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          <div className={`relative bg-white w-full max-w-3xl max-h-[90vh] md:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 ${FAQ_CONFIG.ANIMATION_DURATION}`}>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div>
                <h3 className="text-2xl font-black text-slate-900">All Questions</h3>
                <p className="text-sm text-slate-500">{plantName} Knowledge Base</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-4 bg-slate-50/30">
              {allFaqs.map((faq) => (
                <FAQItem 
                  key={`modal-${faq.plantFaqId}`} 
                  faq={faq} 
                  isOpen={openId === `modal-${faq.plantFaqId}`} 
                  toggle={() => setOpenId(openId === `modal-${faq.plantFaqId}` ? null : `modal-${faq.plantFaqId}`)} 
                />
              ))}
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-white text-center">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all"
              >
                {FAQ_CONFIG.TEXT.MODAL_CLOSE}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function FAQItem({ faq, isOpen, toggle }) {
  return (
    <div className={`transition-all duration-300 rounded-2xl border-2 ${
      isOpen ? "bg-white border-indigo-600 shadow-lg" : "bg-white border-slate-100 hover:border-slate-200 shadow-sm"
    }`}>
      <button onClick={toggle} className="w-full flex items-center justify-between p-5 md:p-6 text-left outline-none">
        <div className="pr-4">
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1 block">
            {faq.type}
          </span>
          <h4 className={`text-base md:text-lg font-bold leading-tight ${isOpen ? "text-slate-900" : "text-slate-700"}`}>
            {faq.question}
          </h4>
        </div>
        <div className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
          isOpen ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"
        }`}>
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </div>
      </button>
      
      <div className={`transition-all duration-500 overflow-hidden ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-5 md:px-6 pb-6">
          <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 flex gap-3">
            <MessageSquare className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-slate-700 text-sm md:text-base leading-relaxed font-medium">{faq.answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}