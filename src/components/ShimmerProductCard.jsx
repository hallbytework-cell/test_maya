const ShimmerProductCard = () => {
    return (
        <div className="w-full max-w-xs bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ">
            <div className="relative h-32 bg-gray-100">
                <ShimmerElement className="h-full w-full" />
                <div className="absolute top-2 left-2 flex space-x-2">
                    <ShimmerElement className="h-6 w-10" />
                </div>
                <div className="absolute top-2 right-2">
                    <ShimmerElement className="h-6 w-16" />
                </div>
            </div>

            {/* Content Area */}
            <div className="p-4 space-y-3">
                <ShimmerElement className="h-5 w-4/5" />
                <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center space-x-2">
                        <ShimmerElement className="h-4 w-16" /> 
                        <ShimmerElement className="h-4 w-10" /> 
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                        <ShimmerElement className="h-5 w-16" />
                        <ShimmerElement className="h-3 w-10" />
                    </div>
                </div>
                <div className="pt-2">
                    <ShimmerElement className="h-9 w-full rounded-lg bg-gray-300" />
                </div>
            </div>
        </div>
    );
};

const ShimmerElement = ({ className = '' }) => (
    <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
);

export default ShimmerProductCard;