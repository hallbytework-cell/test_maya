import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    guestCartItems: [],
    userCartItems: [],
    directCheckoutItem: null,
};

// Helper to create a unique key for a cart item
const getItemKey = (item) => `${item.id}-${item.potVariantId}`;

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToGuestCart: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.guestCartItems.find(
                (item) =>
                    item.id === newItem.id &&
                    item.potVariantId === newItem.potVariantId
            );
            if (existingItem) {
                existingItem.quantity += newItem.quantity;
            } else {
                state.guestCartItems.push({ ...newItem, isSelected: true });
            }
        },
        updateGuestCartItemQuantity: (state, action) => {
            const { plantVariantId, potVariantId, quantity } = action.payload;

            const itemToUpdate = state.guestCartItems.find(
                (item) => item.plantVariantId === plantVariantId && item.potVariantId === potVariantId
            );

            if (itemToUpdate) {
                if (quantity > 0) {
                    itemToUpdate.quantity = quantity;
                } else {
                    const keyToRemove = getItemKey(itemToUpdate);
                    state.guestCartItems = state.guestCartItems.filter(
                        (item) => getItemKey(item) !== keyToRemove
                    );
                }
            }
        },
        removeFromGuestCart: (state, action) => {
            const itemToRemove = action.payload;
            const keyToRemove = getItemKey(itemToRemove);
            state.guestCartItems = state.guestCartItems.filter(
                (item) => getItemKey(item) !== keyToRemove
            );
        },
        removeItemsFromGuestCart: (state, action) => {
            const itemsToRemove = action.payload;
            if (!Array.isArray(itemsToRemove)) return;
            const keysToRemove = new Set(itemsToRemove.map(getItemKey));

            state.guestCartItems = state.guestCartItems.filter(
                (item) => !keysToRemove.has(getItemKey(item))
            );
        },
        clearGuestCart: (state) => {
            state.guestCartItems = [];
        },
        toggleItemSelection: (state, action) => {
            const { id, potVariantId } = action.payload;
            const itemToToggle = state.guestCartItems.find(
                (item) => item.id === id && item.potVariantId === potVariantId
            );

            if (itemToToggle) {
                itemToToggle.isSelected = !itemToToggle.isSelected;
            }
        },
        toggleAllItemsSelection: (state, action) => {
            const selectStatus = action.payload;
            state.guestCartItems.forEach(item => {
                item.isSelected = selectStatus;
            });
        },
        setDirectCheckoutItem: (state, action) => {
            state.directCheckoutItem = action.payload;
        },
        clearDirectCheckoutItem: (state) => {
            state.directCheckoutItem = null;
        },
        setUserCartItems: (state, action) => {
            state.userCartItems = action.payload;
        },
        clearUserCart: (state) => {
            state.userCartItems = [];
        },
    },
});

// Export the new action
export const {
    addToGuestCart,
    updateGuestCartItemQuantity,
    removeFromGuestCart,
    clearGuestCart,

    toggleItemSelection,
    toggleAllItemsSelection,
    removeItemsFromGuestCart,
    setDirectCheckoutItem,
    clearDirectCheckoutItem,

    setUserCartItems,
    clearUserCart,

} = cartSlice.actions;

export default cartSlice.reducer;