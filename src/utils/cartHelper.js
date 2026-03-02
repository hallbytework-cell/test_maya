export const transformCartData = (responseData) => {
    if (!Array.isArray(responseData)) return [];
    
    return responseData.map((item) => ({
        id: item?.id,
        sellingPrice: (item?.plantVariant?.sellingPrice || 0) + (item?.potVariant?.sellingPrice || 0) || 0,
        mrp: (item?.plantVariant?.mrp || 0) + (item?.potVariant?.sellingPrice || 0) || 0,
        prevPrice: item?.priceAtAdd,
        quantity: item?.quantity,
        name: item?.plantVariant?.plantName || "Arpan's Fav Plant - Must Buy",
        image: item?.plantVariant?.imageUrl,
        plantVariantId: item?.plantVariant?.plantVariantId,
        plantSize: item?.plantVariant?.plantSize,
        potType: item?.potVariant?.potTypeName,
        plantColorHex: item?.plantVariant?.colorHex,
        potColorHex: item?.potVariant?.colorHex,
        potVariantId: item?.potVariant?.potVariantId,
    }));
};