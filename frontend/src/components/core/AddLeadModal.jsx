import { X } from "lucide-react";
import { useCreateLead } from "../../hooks/useLeads";

function AddLeadModal({ isOpen, onClose }) {
    const createLead = useCreateLead();

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const name = fd.get("name");
        const company = fd.get("company");
        const phone = fd.get("phone");

        createLead.mutate(
            {
                name,
                company: company || undefined,
                phone: phone || undefined,
            },
            {
                onSuccess: () => {
                    e.target.reset();
                }
            }
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl">
            <div className="w-full max-w-md bg-white dark:bg-[#13131a] rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl shadow-black/20 dark:shadow-black/60">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/8">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        Add New Lead
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-gray-400 dark:text-slate-500
                            hover:text-gray-600 dark:hover:text-white
                            hover:bg-gray-100 dark:hover:bg-white/10
                            transition-all duration-200"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">

                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="name"
                            required
                            placeholder="e.g., John Doe"
                            disabled={createLead.isPending}
                            className="w-full px-3.5 py-2.5 rounded-xl text-sm
                                bg-gray-50 dark:bg-white/5
                                border border-gray-200 dark:border-white/10
                                text-gray-900 dark:text-white
                                placeholder-gray-400 dark:placeholder-slate-500
                                focus:outline-none focus:ring-2
                                focus:ring-indigo-500/30 dark:focus:ring-indigo-500/20
                                focus:border-indigo-400 dark:focus:border-indigo-500/50
                                disabled:opacity-50
                                transition-all duration-200"
                        />
                    </div>

                    {/* Company */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                            Company{" "}
                            <span className="text-gray-400 dark:text-slate-500 font-normal">
                                (Optional)
                            </span>
                        </label>
                        <input
                            name="company"
                            placeholder="e.g., Stark Industries"
                            disabled={createLead.isPending}
                            className="w-full px-3.5 py-2.5 rounded-xl text-sm
                                bg-gray-50 dark:bg-white/5
                                border border-gray-200 dark:border-white/10
                                text-gray-900 dark:text-white
                                placeholder-gray-400 dark:placeholder-slate-500
                                focus:outline-none focus:ring-2
                                focus:ring-indigo-500/30 dark:focus:ring-indigo-500/20
                                focus:border-indigo-400 dark:focus:border-indigo-500/50
                                disabled:opacity-50
                                transition-all duration-200"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                            Phone{" "}
                            <span className="text-gray-400 dark:text-slate-500 font-normal">
                                (Optional)
                            </span>
                        </label>
                        <input
                            name="phone"
                            placeholder="e.g., 555-0123"
                            disabled={createLead.isPending}
                            className="w-full px-3.5 py-2.5 rounded-xl text-sm
                                bg-gray-50 dark:bg-white/5
                                border border-gray-200 dark:border-white/10
                                text-gray-900 dark:text-white
                                placeholder-gray-400 dark:placeholder-slate-500
                                focus:outline-none focus:ring-2
                                focus:ring-indigo-500/30 dark:focus:ring-indigo-500/20
                                focus:border-indigo-400 dark:focus:border-indigo-500/50
                                disabled:opacity-50
                                transition-all duration-200"
                        />
                    </div>

                    {/* Error message */}
                    {createLead.isError && (
                        <p className="text-sm text-red-500">
                            {createLead.error?.response?.data?.message || "Failed to create lead. Please try again."}
                        </p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={createLead.isPending}
                            className="px-4 py-2 text-sm font-medium rounded-xl
                                text-gray-600 dark:text-slate-400
                                bg-gray-100 dark:bg-white/5
                                hover:bg-gray-200 dark:hover:bg-white/10
                                border border-gray-200 dark:border-white/10
                                disabled:opacity-50
                                transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={createLead.isPending}
                            className="px-4 py-2 text-sm font-semibold text-white rounded-xl
                                bg-linear-to-r from-indigo-600 to-violet-600
                                hover:from-indigo-500 hover:to-violet-500
                                shadow-lg shadow-indigo-500/25
                                hover:shadow-indigo-500/40
                                disabled:opacity-50 disabled:cursor-not-allowed
                                transition-all duration-200"
                        >
                            {createLead.isPending ? "Saving..." : "Save Lead"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddLeadModal;