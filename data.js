
// --- DATA OBJECTS (EXPANDED FOR READABILITY) ---
const ZONES = { E: "America/New_York", C: "America/Chicago", M: "America/Denver", P: "America/Los_Angeles", H: "Pacific/Honolulu", AK: "America/Anchorage", G: "Pacific/Guam", AZ: "America/Phoenix", ATL: "America/Halifax", YHZ: "America/Halifax", NFLD: "America/St_Johns", MXC: "America/Mexico_City", MXE: "America/Cancun", MXM: "America/Mazatlan", MXS: "America/San_Jose_Cabo", PVR: "America/Bahia_Banderas", LHR: "Europe/London", DUB: "Europe/Dublin", LIS: "Europe/Lisbon", WET: "Europe/Lisbon", AZO: "Atlantic/Azores", CET: "Europe/Paris", EET: "Europe/Athens", UK: "Europe/London", UTC: "UTC", JST: "Asia/Tokyo", HKG: "Asia/Hong_Kong", SIN: "Asia/Singapore", HKT: "Asia/Taipei", KST: "Asia/Seoul", IST: "Asia/Kolkata", DXB: "Asia/Dubai", TLV: "Asia/Jerusalem", SYD: "Australia/Sydney", MEL: "Australia/Melbourne", BNE: "Australia/Brisbane", AKL: "Pacific/Auckland", PPT: "Pacific/Tahiti", MNL: "Asia/Manila", GRU: "America/Sao_Paulo", EZE: "America/Argentina/Buenos_Aires", SCL: "America/Santiago", LIM: "America/Lima", BOG: "America/Bogota", JNB: "Africa/Johannesburg", LOS: "Africa/Lagos", ACC: "Africa/Accra", DKR: "Africa/Dakar", GOH: "America/Nuuk", FNC: "Atlantic/Madeira", UBN: "Asia/Ulaanbaatar", EAT: "Africa/Addis_Ababa", ICT: "Asia/Bangkok", TRT: "Europe/Istanbul", EGY: "Africa/Cairo", REC_Z: "America/Recife", BRT: "America/Sao_Paulo" };

// Truncated list for brevity in code, but includes major hubs and international stations
const AIRPORTS = { "ITM": "JST", "CAI": "EGY", "IST": "TRT", "SAW": "TRT", "CNF": "BRT", "REC": "REC_Z", "WAW": "CET", "ADD": "EAT", "OSL": "CET", "BKK": "ICT", "VIE": "CET", "CPH": "CET", "ARN": "CET", "TPE": "HKT", "ICN": "KST", "LAS": "P", "SAN": "P", "SEA": "P", "PDX": "P", "PHX": "AZ", "DFW": "C", "AUS": "C", "ORD": "C", "DEN": "M", "IAH": "C", "EWR": "E", "IAD": "E", "SFO": "P", "LAX": "P", "BOS": "E", "MCO": "E", "TPA": "E", "HNL": "H", "GUM": "G", "LHR": "LHR", "EDI": "LHR", "GLA": "LHR", "DUB": "DUB", "SNN": "DUB", "LIS": "LIS", "OPO": "LIS", "FAO": "LIS", "FNC": "FNC", "CDG": "CET", "NCE": "CET", "AMS": "CET", "BRU": "CET", "FRA": "CET", "MUC": "CET", "BER": "CET", "ZRH": "CET", "GVA": "CET", "MXP": "CET", "FCO": "CET", "VCE": "CET", "NAP": "CET", "PMO": "CET", "MAD": "CET", "BCN": "CET", "AGP": "CET", "PMI": "CET", "BIO": "CET", "ATH": "EET", "DBV": "CET", "SPU": "CET", "KEF": "UTC", "NRT": "JST", "HND": "JST", "KIX": "JST", "NGO": "JST", "FUK": "JST", "PEK": "HKT", "PVG": "HKT", "HKG": "HKG", "KHH": "HKT", "UBN": "UBN", "SIN": "SIN", "MNL": "MNL", "CEB": "MNL", "DEL": "IST", "BOM": "IST", "TLV": "TLV", "DXB": "DXB", "AMM": "EET", "SYD": "SYD", "MEL": "MEL", "BNE": "BNE", "AKL": "AKL", "CHC": "AKL", "PPT": "PPT", "SPN": "G", "ROR": "G", "YAP": "G", "TKK": "G", "PNI": "G", "KSA": "G", "MAJ": "G", "GRU": "GRU", "GIG": "GRU", "EZE": "EZE", "SCL": "SCL", "LIM": "LIM", "BOG": "BOG", "MDE": "BOG", "UIO": "BOG", "PTY": "BOG", "SJO": "C", "LIR": "C", "GUA": "C", "SAL": "C", "BZE": "C", "RTB": "C", "SAP": "C", "MEX": "MXC", "CUN": "MXE", "SJD": "MXS", "PVR": "PVR", "MZT": "MXM", "GDL": "MXC", "MTY": "MXC", "YVR": "P", "YYC": "M", "YEG": "M", "YWG": "C", "YYZ": "E", "YUL": "E", "YOW": "E", "YHZ": "YHZ", "YYT": "NFLD", "GOH": "GOH", "JNB": "JNB", "CPT": "JNB", "ACC": "ACC", "LOS": "LOS", "DKR": "DKR", "RAK": "CET", "DCA": "E", "BWI": "E", "LGA": "E", "JFK": "E", "MDW": "C", "OAK": "P", "BUR": "P", "SNA": "P", "SMF": "P", "PSP": "P", "RNO": "P", "ONT": "P", "LGB": "P", "SJC": "P", "FAT": "P", "MRY": "P", "SBA": "P", "SBP": "P", "ACV": "P", "RDD": "P", "BFL": "P", "EUG": "P", "MFR": "P", "RDM": "P", "GEG": "P", "PSC": "P", "EAT": "P", "YKM": "P", "ALW": "P", "PUW": "P", "LWS": "P", "STS": "P", "SLC": "M", "ABQ": "M", "BOI": "M", "BIL": "M", "BZN": "M", "JAC": "M", "COS": "M", "ASE": "M", "EGE": "M", "GJT": "M", "DRO": "M", "MTJ": "M", "HDN": "M", "PUB": "M", "GUC": "M", "SAF": "M", "ROW": "M", "HOB": "M", "FMN": "M", "LARC": "M", "CPR": "M", "GCC": "M", "RKS": "M", "COD": "M", "IDA": "M", "SUN": "M", "TWF": "M", "PIH": "M", "HLN": "M", "GTF": "M", "FCA": "M", "MSO": "M", "BTM": "M", "RAP": "M", "ELP": "M", "SGU": "M", "TUS": "AZ", "FLG": "AZ", "YUM": "AZ", "PRC": "AZ", "SAT": "C", "MSY": "C", "BNA": "C", "STL": "C", "MCI": "C", "MSP": "C", "OMA": "C", "OKC": "C", "TUL": "C", "ICT": "C", "DSM": "C", "CID": "C", "MEM": "C", "LIT": "C", "XNA": "C", "FSM": "C", "SGF": "C", "JLN": "C", "COU": "C", "DAL": "C", "HOU": "C", "MAF": "C", "LBB": "C", "AMA": "C", "CRP": "C", "MFE": "C", "BRO": "C", "LRD": "C", "ABI": "C", "SJT": "C", "TYR": "C", "GGG": "C", "BPT": "C", "LFT": "C", "BTR": "C", "SHV": "C", "MLU": "C", "AEX": "C", "GPT": "C", "JAN": "C", "MOB": "C", "BHM": "C", "HSV": "C", "MGM": "C", "VPS": "C", "ECP": "C", "PNS": "C", "DHN": "C", "EVV": "C", "FSD": "C", "FAR": "C", "BIS": "C", "MOT": "C", "DIK": "C", "XWA": "C", "JMS": "C", "DVL": "C", "BRD": "C", "HIB": "C", "INL": "C", "BJI": "C", "RST": "C", "DLH": "C", "LSE": "C", "CWA": "C", "AUW": "C", "EAU": "C", "RHI": "C", "ATW": "C", "GRB": "C", "MSN": "C", "MKE": "C", "MLI": "C", "PIA": "C", "BMI": "C", "CMI": "C", "DEC": "C", "SPI": "C", "SBN": "C", "FWA": "C", "IND": "C", "PHL": "E", "CLT": "E", "MIA": "E", "ATL": "E", "DTW": "E", "CLE": "E", "PIT": "E", "RDU": "E", "CVG": "E", "CMH": "E", "DAY": "E", "CAK": "E", "TOL": "E", "RIC": "E", "ORF": "E", "ROA": "E", "CHO": "E", "LYH": "E", "SHD": "E", "CRW": "E", "CKB": "E", "MGW": "E", "HTS": "E", "PKB": "E", "LWB": "E", "BKW": "E", "EKE": "E", "AVP": "E", "MDT": "E", "ABE": "E", "SCE": "E", "ERI": "E", "JST": "E", "AOO": "E", "DUJ": "E", "FKL": "E", "BFD": "E", "IPT": "E", "BUF": "E", "ROC": "E", "SYR": "E", "ALB": "E", "HPN": "E", "ISP": "E", "SWF": "E", "BGM": "E", "ELM": "E", "ITH": "E", "ART": "E", "OGS": "E", "MSS": "E", "PLB": "E", "SLK": "E", "BTV": "E", "RUT": "E", "MPV": "E", "PWM": "E", "BGR": "E", "PQI": "E", "BHB": "E", "RKD": "E", "AUG": "E", "MHT": "E", "LEB": "E", "PVD": "E", "BDL": "E", "HVN": "E", "GON": "E", "ILM": "E", "AVL": "E", "FAY": "E", "OAJ": "E", "EWN": "E", "PGV": "E", "GSP": "E", "CHS": "E", "MYR": "E", "CAE": "E", "HXD": "E", "SAV": "E", "AGS": "E", "CSG": "E", "VLD": "E", "ABY": "E", "BQK": "E", "TLH": "E", "JAX": "E", "DAB": "E", "MLB": "E", "VRB": "E", "PBI": "E", "RSW": "E", "SRQ": "E", "PIE": "E", "GNV": "E", "EYW": "E", "GRR": "E", "TVC": "E", "LAN": "E", "FNT": "E", "AZO": "E", "MBS": "E", "CMX": "E", "PLN": "E", "MQT": "E", "IMT": "E", "ESC": "E", "APN": "E", "CIU": "E", "SDF": "E", "LEX": "E", "PAH": "E", "CHA": "E", "TYS": "E", "TRI": "E", "ANC": "AK", "FAI": "AK", "JNU": "AK", "KTN": "AK", "SIT": "AK", "CDV": "AK", "YAK": "AK", "PSG": "AK", "WRG": "AK", "OME": "AK", "BET": "AK", "SCC": "AK", "BRW": "AK", "OTZ": "AK", "ADQ": "AK", "DLG": "AK", "AKN": "AK", "DUT": "AK", "OGG": "H", "KOA": "H", "LIH": "H", "ITO": "H", "CZM": "MXE", "ZIH": "MXC", "HUX": "MXC", "ACA": "MXC", "BJX": "MXC", "QRO": "MXC", "SLP": "MXC", "MID": "MXC", "VER": "MXC", "TAM": "MXC", "OAX": "MXC", "ZCL": "MXC", "HMO": "AZ" };

const MANUAL_ZONES = {
    "North America": [
        { name: "Eastern Time", val: "America/New_York", short: "ET" },
        { name: "Central Time", val: "America/Chicago", short: "CT" },
        { name: "Mountain Time", val: "America/Denver", short: "MT" },
        { name: "Pacific Time", val: "America/Los_Angeles", short: "PT" },
        { name: "Arizona (No DST)", val: "America/Phoenix", short: "AZ" },
        { name: "Alaska Time", val: "America/Anchorage", short: "AKT" },
        { name: "Hawaii Time", val: "Pacific/Honolulu", short: "HST" },
        { name: "Atlantic (Halifax)", val: "America/Halifax", short: "AST" },
        { name: "Newfoundland", val: "America/St_Johns", short: "NST" }
    ],
    "Europe": [
        { name: "London (UK)", val: "Europe/London", short: "UK" },
        { name: "Central Europe (Paris/FRA)", val: "Europe/Paris", short: "CET" },
        { name: "Eastern Europe (Athens)", val: "Europe/Athens", short: "EET" },
        { name: "Western Europe (Lisbon)", val: "Europe/Lisbon", short: "WET" },
        { name: "Turkey (TRT)", val: "Europe/Istanbul", short: "TRT" },
        { name: "Iceland (UTC)", val: "UTC", short: "UTC" }
    ],
    "Asia & Pacific": [
        { name: "Japan/Korea", val: "Asia/Tokyo", short: "JST" },
        { name: "China/Taiwan/HK", val: "Asia/Hong_Kong", short: "HKT" },
        { name: "Singapore/Manila", val: "Asia/Singapore", short: "SGT" },
        { name: "Thailand/Vietnam", val: "Asia/Bangkok", short: "ICT" },
        { name: "India", val: "Asia/Kolkata", short: "IST" },
        { name: "Guam (Chamorro)", val: "Pacific/Guam", short: "ChST" },
        { name: "Sydney (AEST)", val: "Australia/Sydney", short: "AEST" },
        { name: "Auckland (NZ)", val: "Pacific/Auckland", short: "NZT" },
        { name: "Tahiti", val: "Pacific/Tahiti", short: "TAHT" }
    ],
    "Other": [
        { name: "Dubai", val: "Asia/Dubai", short: "GST" },
        { name: "Tel Aviv", val: "Asia/Jerusalem", short: "IST" },
        { name: "Cairo", val: "Africa/Cairo", short: "EGY" },
        { name: "Addis Ababa", val: "Africa/Addis_Ababa", short: "EAT" },
        { name: "South Africa", val: "Africa/Johannesburg", short: "SAST" },
        { name: "Sao Paulo", val: "America/Sao_Paulo", short: "BRT" },
        { name: "Recife (No DST)", val: "America/Recife", short: "REC" }
    ]
};

const BASES = [
    { c: "AUS", z: "C" }, { c: "BOS", z: "E" }, { c: "CLE", z: "E" }, { c: "DEN", z: "M" }, { c: "EWR", z: "E" },
    { c: "FLL", z: "E" }, { c: "GUM", z: "G" }, { c: "HNL", z: "H" }, { c: "IAD", z: "E" }, { c: "IAH", z: "C" },
    { c: "LAS", z: "P" }, { c: "LAX", z: "P" }, { c: "LHR", z: "LHR" }, { c: "MCO", z: "E" }, { c: "ORD", z: "C" },
    { c: "PHX", z: "AZ" }, { c: "SAN", z: "P" }, { c: "SFO", z: "P" }, { c: "TPA", z: "E" }, { c: "DCA", z: "E" },
    { c: "BWI", z: "E" }, { c: "LGA", z: "E" }, { c: "JFK", z: "E" }, { c: "MDW", z: "C" }, { c: "OAK", z: "P" },
    { c: "BUR", z: "P" }, { c: "SNA", z: "P" }
];

// Populate base zones
BASES.forEach(b => AIRPORTS[b.c] = b.z);
const ALL_CODES = { ...AIRPORTS };

const CO_TERMS = {
    'DCA': { 'BWI': 70, 'IAD': 70 }, 'IAD': { 'DCA': 70, 'BWI': 105 }, 'BWI': { 'DCA': 70, 'IAD': 105 },
    'EWR': { 'LGA': 90, 'JFK': 105 }, 'LGA': { 'EWR': 90, 'JFK': 60 }, 'JFK': { 'EWR': 105, 'LGA': 60 },
    'ORD': { 'MDW': 120 }, 'MDW': { 'ORD': 120 },
    'SFO': { 'OAK': 60 }, 'OAK': { 'SFO': 60 },
    'LAX': { 'BUR': 75, 'SNA': 120 }, 'BUR': { 'LAX': 75, 'SNA': 135 }, 'SNA': { 'LAX': 120, 'BUR': 135 }
};

const INFO_CONTENT = {
    'dhd': { title: 'Deadhead (DHD)', text: 'Select if your final segment is a Deadhead. Deadheads have a 0-minute debrief time.' },
    'custStart': { title: 'Customs at Start', text: 'Select if you must clear customs at the beginning of your duty period. Adds 15 minutes to your duty day.' },
    'custEnd': { title: 'Customs at End', text: 'Select if you must clear customs after your final segment. Adds 15 minutes to your duty day.' },
    'hvt': { title: 'High Value Trip (JCBA Sec 6.S.1)', text: 'A High Value Trip (HVT) shall be limited to a single duty period containing:\n• No more than three (3) flight segments\n• Total flight time of nine hours (9:00) or more' },
    'mixed': { title: 'Definitions & Mixed Pairings', text: '<b>Mixed Pairings (Sec 6.U):</b><br>• Use <b>DOMESTIC</b> mode if your duty period today contains ONLY domestic flights.<br>• Use <b>INTERNATIONAL</b> mode if your duty period today contains ANY international flights.<br><br><b>Domestic Definition (Sec 2.G):</b><br>• All Company certified routes or charter operations within the 50 United States, Puerto Rico, Canada, Mexico, Central America, and the Caribbean.<br><br><b>International Definition (Sec 2.S):</b><br>• All Company certified routes or charter operations to and from the continents of South America, Europe, Asia, Africa, Australia, and Antarctica.<br>• International Flying includes flying to and from Guam and any other island countries and territories outside the Caribbean.' },
    'coterm': { title: 'Co-Terminal Extension', text: 'Check this box ONLY if this is the final duty period of your pairing AND it terminates at a different co-terminal than your pairing began.\n\n(Example: Pairing started at EWR but ends at LGA).' },
    'report': { title: 'Report for Duty Info', text: '• Enter the airport code of the city you reported to at the start of the duty day. If the timezone does not populate, check your airport code or you can adjust it manually.\n• Next, in the Local Report Time field, enter your local report time from your pairing OR the time you actually reported (if different).\n• Then proceed to the Departure Flight Info section.' },
    'departure': { title: 'Departure Flight Info', text: '• Enter the airport code of the departure city of your next flight segment.\n• Enter the scheduled flight time for this segment as HHMM.' },
    'firstTime': { title: 'Quick Start Guide', text: '1. Select your Mode (Domestic/International).\n2. Enter your Duty Date and Pairing Origination.\n3. Enter your Report City and Time. The calculator will auto-detect time zones (or ask you if it\'s unsure).\n4. Enter your Departure City and <b>Scheduled</b> Flight Time.\n5. Select any modifiers (HVT, Deadhead, Customs).\n6. Click Calculate to see your legal Door Closure time.' },
    'domMatrix': { title: 'Domestic Actual Max Duty Limits', text: 'Report Time (Home Domicile Time)\n\n0500 - 1859 .... 15:00\n1900 - 0459 .... 13:00\nHigh Value Trip .... 16:00\n\n(Source: JCBA Section 6.S.1)' },
    'intMatrix': { title: 'International Actual Max Duty Limits', text: 'Flight Time (Scheduled)\n\nMulti/Non-Stop ≤ 8:00 .... 16:00\nMulti/Non-Stop 8:01 - 12:00 .... 16:30\nNon-Stop > 12:00 .... Check-in + Flight + Customs + Debrief + 3:30\n\n(Source: JCBA Section 6.T.1)' },
    'domFlying': { title: 'Domestic Flying', text: '“Domestic Flying” or “Domestic Flight”, for scheduling purposes, means all Company certified routes or charter operations within the 50 United States, Puerto Rico, Canada, Mexico, Central America, and the Caribbean.' },
    'intFlying': { title: 'International Flying', text: '“International Flying” or “International Flight”, for scheduling purposes, means all Company certified routes or charter operations to and from the continents of South America, Europe, Asia, Africa, Australia, and Antarctica. International Flying includes flying to and from Guam and any other island countries and territories outside the Caribbean.' }
};
