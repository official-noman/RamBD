import checkoutApi from "@utils/__api__/checkout";

// Add this helper function at the top level, outside the component
const getLocationName = (id: any, locations: any[], nameField: string) => {
    if (!id) return "";
    const location = locations.find(l => l.id == id);
    return location ? location[nameField] : id.toString();
};
