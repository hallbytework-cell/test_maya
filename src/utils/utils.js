const sizeMap = {
    "XS": "EXTRA_SMALL",
    "XL": "EXTRA_LARGE",
    "L": "LARGE",
    "M": "MEDIUM",
    "S": "SMALL",
    
};

const potNameMap={
    "Eco Friendly": "ECO_FRIENDLY",
    "Classic":"CLASSIC",
    "Standard":"STANDARD",
    "Premium":"PREMIUM",
    "Exclusive":"EXCLUSIVE" //should be chnaged with ELITE in future
}


export function sizeToAbbreviation(verboseSize) {
    const normalizedInput = verboseSize.toUpperCase().replace(/ /g, '_');

    for (const abbreviation in sizeMap) {
        if (sizeMap[abbreviation] === normalizedInput) {
            return abbreviation;
        }
    }
    return undefined;
}

export function potToAbbreviation(verbosePot) {
    const normalizedInput = verbosePot.toUpperCase().replace(/ /g, '_');

    for (const abbreviation in potNameMap) {
        if (potNameMap[abbreviation] === normalizedInput) {
            return abbreviation;
        }
    }
    return undefined;
}
export function getSortParams(sortId){
  switch (sortId) {
    case "price_asc":
      return { orderByPrice: "asc" };
    case "price_desc":
      return { orderByPrice : "desc" };
    case "newest":
      return { sortBy: "createdAt", sortOrder: "desc" };
    case "rating":
      return { sortBy: "rating", sortOrder: "desc" };
    case "recommended":
    default:
      return {};
  }
};

export const mapCategoryDBToUI = (dbKey) => {
  if (!dbKey) return "";
  return dbKey.toLowerCase().replace(/_/g, '-');
};

export const mapCategoryUIToDB = (uiKey) => {
  if (!uiKey) return "";
  return uiKey.toUpperCase().replace(/-/g, '_');
};

export const nameToSlug = (name) => {
  if (!name) return "";
  
  return name
    .toLowerCase()             
    .trim()                  
    .replace(/\s+/g, '-')      
    // .replace(/[^a-z0-9-]/g, ''); 
};

// TEST_TEST -> Test Test
export const formatLabel = (str) => {
  return str
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};