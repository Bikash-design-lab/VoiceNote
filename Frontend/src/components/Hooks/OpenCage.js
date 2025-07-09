const VITE_OpenCage_KEY = import.meta.env.VITE_OpenCage_KEY

export const fetchLocationName = async (latitude, longitude) => {
    try {
        const res = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${VITE_OpenCage_KEY}`
        );
        const data = await res.json();
        console.log(data.results[0]?.formatted)
        return data.results[0]?.formatted || "Unknown location";
    } catch (error) {
        console.error("Reverse Geocoding Error:", error);
        return "Unable to fetch location name";
    }
};

