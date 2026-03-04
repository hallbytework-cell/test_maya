import axiosInstance from "../../config/axiosConfig";

export const getAllPlants = async ({ page = 1, limit = 10, skip, plantCategory }) => {
    const response = await axiosInstance.get("/plants", {
        params: {
            page,
            limit,
            skip,
            plantCategory,
        },
    });
    return response.data;
};

export const getPlantById = async (id) => {
    const response = await axiosInstance.get(`/plants/${id}`);
    return response.data;
};

export const getPlantByVariantId = async (id) => {
    const response = await axiosInstance.get(`/plants/variant/${id}`);
    return response.data;
};

export const searchPlants = async ({ search, options = {} }) => {
    const { page = 1, limit = 10, skip, plantCategory } = options;
    const response = await axiosInstance.get(`/plants/search/${search}`, {
        params: {
            page,
            limit,
            skip,
            plantCategory,
        },
    });
    return response.data;
};

export const getAllPlantVariants = async (queryString) => {
    const response = await axiosInstance.get(`/plants/variants/dynamic?${queryString}`);
    return response.data;
};

export const getPlantsByTag = async (tag, limit = 8) => {
    const route = "/plants/variants/dynamic";
    const params = {
        tagNames: tag,
        page: 1,
        limit: limit,
    };

    const response = await axiosInstance.get(route, { params });
    return response.data.data.plantVariants;
};

export const getPlantCategories = async () => {
    const response = await axiosInstance.get('/plants/categories');
    return response.data.data;
};

export const getActivePlantReels = async (reelType) => {
    const params = { reelType };
    const response = await axiosInstance.get("/plant-reels", { params });
    return response.data.data;
};

export const getPlantCareBySize = async (plantId, size) => {
    const response = await axiosInstance.get(
        `/plants/${plantId}/care/${size}`
    );
    return response.data;
};

export const getPopularSearches = async () => {
    const response = await axiosInstance.get("/plants/popular-searches");
    return response.data.data;
};

export const getPlantFAQs = async (plantId, options = {}) => {
    const { faqType, page = 1, limit = 10, skip } = options;
    const response = await axiosInstance.get(`/plants/${plantId}/faqs`, {
        params: {
            faqType,
            page,
            limit,
            skip,
        },
    });
    return response.data;
};