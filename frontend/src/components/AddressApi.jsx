// Address.js
const addressData = {
    "Madhya Pradesh": {
        "Anuppur": [],
        "Ashoknagar": [],
        "Agar Malwa": [],
        "Alirajpur": [],
        "Indore": [],
        "Ujjain": [],
        "Umaria": [],
        "Katni": [],
        "Khandwa": [],
        "Khargone": [],
        "Guna": [],
        "Gwalior": [],
        "Chhatarpur": [],
        "Chhindwara": [],
        "Jabalpur": [],
        "Jhabua": [],
        "Tikamgarh": [],
        "Dindori": [],
        "Datia": [],
        "Damoh": [],
        "Dewas": [],
        "Dhar": [],
        "Narsinghpur": [],
        "Niwari": [],
        "Neemuch": [],
        "Panna": [],
        "Barwani": [],
        "Balaghat": [],
        "Burhanpur": [],
        "Betul": [],
        "Bhind": [],
        "Bhopal": [],
        "Mandla": [],
        "Mandsaur": [],
        "Morena": [],
        "Ratlam": [],
        "Rajgarh": [],
        "Raisen": [],
        "Rewa": [],
        "Vidisha": [],
        "Shahdol": [],
        "Shajapur": [],
        "Shivpuri": [],
        "Sheopur": [],
        "Satna": [],
        "Sagar": [],
        "Singrauli": [],
        "Seoni": [],
        "Sidhi": [],
        "Sehore": [],
        "Harda": [],
        "Hoshangabad": []
      },
    "Maharashtra": {
      "Mumbai": ["VillageX", "VillageY"],
      "Pune": ["VillageP", "VillageQ"]
    }
  };
  
  
export function getAddress(stateEnable, state = null, district = null) {
    if (stateEnable && !state) {
      // Return all states
      return Object.keys(addressData);
    } else if (stateEnable && state && !district) {
      // Return districts of the provided state
      return addressData[state] ? Object.keys(addressData[state]) : [];
    } else if (stateEnable && state && district) {
      // Return villages of the provided district
      return addressData[state] && addressData[state][district] ? addressData[state][district] : [];
    }
    return [];
  }
  