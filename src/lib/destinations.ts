// US cities with population greater than 250,000
export interface Destination {
  id: string;
  name: string;
  state: string;
  lat: number;
  lon: number;
  description: string;
  population: number;
}

export const destinations: Destination[] = [
  // Top 100 US cities by population (250,000+)

  // New York
  { id: "new-york", name: "New York City", state: "NY", lat: 40.7128, lon: -74.0060, description: "The city that never sleeps", population: 8336817 },
  { id: "buffalo", name: "Buffalo", state: "NY", lat: 42.8864, lon: -78.8784, description: "Gateway to Niagara Falls", population: 278349 },

  // California
  { id: "los-angeles", name: "Los Angeles", state: "CA", lat: 34.0522, lon: -118.2437, description: "Entertainment capital with beaches", population: 3979576 },
  { id: "san-diego", name: "San Diego", state: "CA", lat: 32.7157, lon: -117.1611, description: "Beaches, zoo, and perfect weather", population: 1423851 },
  { id: "san-jose", name: "San Jose", state: "CA", lat: 37.3382, lon: -121.8863, description: "Heart of Silicon Valley", population: 1013240 },
  { id: "san-francisco", name: "San Francisco", state: "CA", lat: 37.7749, lon: -122.4194, description: "Iconic city by the bay", population: 873965 },
  { id: "fresno", name: "Fresno", state: "CA", lat: 36.7378, lon: -119.7871, description: "Gateway to Yosemite", population: 542107 },
  { id: "sacramento", name: "Sacramento", state: "CA", lat: 38.5816, lon: -121.4944, description: "California's capital city", population: 524943 },
  { id: "long-beach", name: "Long Beach", state: "CA", lat: 33.7701, lon: -118.1937, description: "Coastal city with urban vibe", population: 466742 },
  { id: "oakland", name: "Oakland", state: "CA", lat: 37.8044, lon: -122.2712, description: "Diverse East Bay city", population: 433031 },
  { id: "bakersfield", name: "Bakersfield", state: "CA", lat: 35.3733, lon: -119.0187, description: "Southern San Joaquin Valley", population: 403455 },
  { id: "anaheim", name: "Anaheim", state: "CA", lat: 33.8366, lon: -117.9143, description: "Home of Disneyland", population: 350365 },
  { id: "santa-ana", name: "Santa Ana", state: "CA", lat: 33.7455, lon: -117.8677, description: "Orange County seat", population: 310227 },
  { id: "riverside", name: "Riverside", state: "CA", lat: 33.9806, lon: -117.3755, description: "Inland Empire hub", population: 314998 },
  { id: "stockton", name: "Stockton", state: "CA", lat: 37.9577, lon: -121.2908, description: "Central Valley port city", population: 320804 },
  { id: "irvine", name: "Irvine", state: "CA", lat: 33.6846, lon: -117.8265, description: "Master-planned Orange County city", population: 307670 },

  // Texas
  { id: "houston", name: "Houston", state: "TX", lat: 29.7604, lon: -95.3698, description: "Space city diversity", population: 2320268 },
  { id: "san-antonio", name: "San Antonio", state: "TX", lat: 29.4241, lon: -98.4936, description: "River Walk and history", population: 1547253 },
  { id: "dallas", name: "Dallas", state: "TX", lat: 32.7767, lon: -96.7970, description: "Big city Texas style", population: 1304379 },
  { id: "austin", name: "Austin", state: "TX", lat: 30.2672, lon: -97.7431, description: "Live music capital", population: 978908 },
  { id: "fort-worth", name: "Fort Worth", state: "TX", lat: 32.7555, lon: -97.3308, description: "Where the West begins", population: 918915 },
  { id: "el-paso", name: "El Paso", state: "TX", lat: 31.7619, lon: -106.4850, description: "Sun city on the border", population: 678815 },
  { id: "arlington-tx", name: "Arlington", state: "TX", lat: 32.7357, lon: -97.1081, description: "Entertainment and sports hub", population: 394266 },
  { id: "corpus-christi", name: "Corpus Christi", state: "TX", lat: 27.8006, lon: -97.3964, description: "Sparkling city by the sea", population: 317863 },
  { id: "plano", name: "Plano", state: "TX", lat: 33.0198, lon: -96.6989, description: "Thriving Dallas suburb", population: 285494 },
  { id: "laredo", name: "Laredo", state: "TX", lat: 27.5306, lon: -99.4803, description: "Gateway to Mexico", population: 255473 },
  { id: "lubbock", name: "Lubbock", state: "TX", lat: 33.5779, lon: -101.8552, description: "Hub of the South Plains", population: 263930 },
  { id: "garland", name: "Garland", state: "TX", lat: 32.9126, lon: -96.6389, description: "Dallas suburb with character", population: 246018 },

  // Florida
  { id: "jacksonville", name: "Jacksonville", state: "FL", lat: 30.3322, lon: -81.6557, description: "Largest city by area in US", population: 911507 },
  { id: "miami", name: "Miami", state: "FL", lat: 25.7617, lon: -80.1918, description: "Art deco and tropical vibes", population: 467963 },
  { id: "tampa", name: "Tampa", state: "FL", lat: 27.9506, lon: -82.4572, description: "Bay area beaches", population: 399700 },
  { id: "orlando", name: "Orlando", state: "FL", lat: 28.5383, lon: -81.3792, description: "Theme park capital", population: 307573 },
  { id: "st-petersburg", name: "St. Petersburg", state: "FL", lat: 27.7676, lon: -82.6403, description: "Sunshine city on the Gulf", population: 258308 },

  // Illinois
  { id: "chicago", name: "Chicago", state: "IL", lat: 41.8781, lon: -87.6298, description: "The Windy City", population: 2746388 },

  // Pennsylvania
  { id: "philadelphia", name: "Philadelphia", state: "PA", lat: 39.9526, lon: -75.1652, description: "City of brotherly love", population: 1584064 },
  { id: "pittsburgh", name: "Pittsburgh", state: "PA", lat: 40.4406, lon: -79.9959, description: "Steel city renaissance", population: 302971 },

  // Arizona
  { id: "phoenix", name: "Phoenix", state: "AZ", lat: 33.4484, lon: -112.0740, description: "Desert sun and golf paradise", population: 1608139 },
  { id: "tucson", name: "Tucson", state: "AZ", lat: 32.2226, lon: -110.9747, description: "Sonoran desert beauty", population: 542629 },
  { id: "mesa", name: "Mesa", state: "AZ", lat: 33.4152, lon: -111.8315, description: "Phoenix suburb with culture", population: 504258 },
  { id: "chandler", name: "Chandler", state: "AZ", lat: 33.3062, lon: -111.8413, description: "Tech hub in the desert", population: 275987 },
  { id: "scottsdale", name: "Scottsdale", state: "AZ", lat: 33.4942, lon: -111.9261, description: "Luxury desert resort town", population: 241361 },
  { id: "gilbert", name: "Gilbert", state: "AZ", lat: 33.3528, lon: -111.7890, description: "Family-friendly Phoenix suburb", population: 267918 },
  { id: "glendale-az", name: "Glendale", state: "AZ", lat: 33.5387, lon: -112.1860, description: "Sports and entertainment", population: 248325 },

  // Ohio
  { id: "columbus", name: "Columbus", state: "OH", lat: 39.9612, lon: -82.9988, description: "Ohio's capital and largest city", population: 905748 },
  { id: "cleveland", name: "Cleveland", state: "OH", lat: 41.4993, lon: -81.6944, description: "Rock and Roll Hall of Fame", population: 372624 },
  { id: "cincinnati", name: "Cincinnati", state: "OH", lat: 39.1031, lon: -84.5120, description: "Queen City on the Ohio River", population: 309317 },
  { id: "toledo", name: "Toledo", state: "OH", lat: 41.6528, lon: -83.5379, description: "Glass City", population: 270871 },

  // North Carolina
  { id: "charlotte", name: "Charlotte", state: "NC", lat: 35.2271, lon: -80.8431, description: "Queen city vibes", population: 874579 },
  { id: "raleigh", name: "Raleigh", state: "NC", lat: 35.7796, lon: -78.6382, description: "City of Oaks", population: 467665 },
  { id: "greensboro", name: "Greensboro", state: "NC", lat: 36.0726, lon: -79.7920, description: "Gate City of the South", population: 299035 },
  { id: "durham", name: "Durham", state: "NC", lat: 35.9940, lon: -78.8986, description: "Bull City innovation hub", population: 283506 },
  { id: "winston-salem", name: "Winston-Salem", state: "NC", lat: 36.0999, lon: -80.2442, description: "Twin City of arts", population: 249545 },

  // Indiana
  { id: "indianapolis", name: "Indianapolis", state: "IN", lat: 39.7684, lon: -86.1581, description: "Crossroads of America", population: 887642 },
  { id: "fort-wayne", name: "Fort Wayne", state: "IN", lat: 41.0793, lon: -85.1394, description: "Summit City", population: 263886 },

  // Washington
  { id: "seattle", name: "Seattle", state: "WA", lat: 47.6062, lon: -122.3321, description: "Emerald city", population: 737015 },
  { id: "spokane", name: "Spokane", state: "WA", lat: 47.6588, lon: -117.4260, description: "Lilac City in the Inland Northwest", population: 228989 },

  // Colorado
  { id: "denver", name: "Denver", state: "CO", lat: 39.7392, lon: -104.9903, description: "Mile high city", population: 715522 },
  { id: "colorado-springs", name: "Colorado Springs", state: "CO", lat: 38.8339, lon: -104.8214, description: "Olympic City USA", population: 478961 },
  { id: "aurora-co", name: "Aurora", state: "CO", lat: 39.7294, lon: -104.8319, description: "Gateway to the Rockies", population: 386261 },

  // Massachusetts
  { id: "boston", name: "Boston", state: "MA", lat: 42.3601, lon: -71.0589, description: "Historic New England", population: 692600 },

  // District of Columbia
  { id: "washington-dc", name: "Washington D.C.", state: "DC", lat: 38.9072, lon: -77.0369, description: "Nation's capital", population: 689545 },

  // Tennessee
  { id: "nashville", name: "Nashville", state: "TN", lat: 36.1627, lon: -86.7816, description: "Music city magic", population: 689447 },
  { id: "memphis", name: "Memphis", state: "TN", lat: 35.1495, lon: -90.0490, description: "Blues and BBQ", population: 633104 },

  // Oklahoma
  { id: "oklahoma-city", name: "Oklahoma City", state: "OK", lat: 35.4676, lon: -97.5164, description: "Big Friendly", population: 681054 },
  { id: "tulsa", name: "Tulsa", state: "OK", lat: 36.1540, lon: -95.9928, description: "Oil capital of the world", population: 413066 },

  // Nevada
  { id: "las-vegas", name: "Las Vegas", state: "NV", lat: 36.1699, lon: -115.1398, description: "Entertainment and desert heat", population: 641903 },
  { id: "henderson", name: "Henderson", state: "NV", lat: 36.0395, lon: -114.9817, description: "Vegas suburb with charm", population: 317610 },
  { id: "reno", name: "Reno", state: "NV", lat: 39.5296, lon: -119.8138, description: "Biggest Little City", population: 264165 },
  { id: "north-las-vegas", name: "North Las Vegas", state: "NV", lat: 36.1989, lon: -115.1175, description: "Growing Vegas suburb", population: 262527 },

  // Maryland
  { id: "baltimore", name: "Baltimore", state: "MD", lat: 39.2904, lon: -76.6122, description: "Charm City", population: 585708 },

  // Wisconsin
  { id: "milwaukee", name: "Milwaukee", state: "WI", lat: 43.0389, lon: -87.9065, description: "Brew City on Lake Michigan", population: 577222 },
  { id: "madison", name: "Madison", state: "WI", lat: 43.0731, lon: -89.4012, description: "City of Four Lakes", population: 269840 },

  // New Mexico
  { id: "albuquerque", name: "Albuquerque", state: "NM", lat: 35.0844, lon: -106.6504, description: "High desert culture", population: 564559 },

  // Kentucky
  { id: "louisville", name: "Louisville", state: "KY", lat: 38.2527, lon: -85.7585, description: "Derby City", population: 633045 },
  { id: "lexington", name: "Lexington", state: "KY", lat: 38.0406, lon: -84.5037, description: "Horse Capital of the World", population: 322570 },

  // Oregon
  { id: "portland", name: "Portland", state: "OR", lat: 45.5152, lon: -122.6784, description: "Keep Portland Weird", population: 652503 },

  // Georgia
  { id: "atlanta", name: "Atlanta", state: "GA", lat: 33.7490, lon: -84.3880, description: "Southern metropolis", population: 498715 },

  // Missouri
  { id: "kansas-city", name: "Kansas City", state: "MO", lat: 39.0997, lon: -94.5786, description: "City of Fountains", population: 508090 },
  { id: "st-louis", name: "St. Louis", state: "MO", lat: 38.6270, lon: -90.1994, description: "Gateway to the West", population: 301578 },

  // Virginia
  { id: "virginia-beach", name: "Virginia Beach", state: "VA", lat: 36.8529, lon: -75.9780, description: "East coast resort", population: 459470 },
  { id: "norfolk", name: "Norfolk", state: "VA", lat: 36.8508, lon: -76.2859, description: "Naval Station hub", population: 244076 },
  { id: "chesapeake", name: "Chesapeake", state: "VA", lat: 36.7682, lon: -76.2875, description: "Great Dismal Swamp gateway", population: 249422 },
  { id: "richmond", name: "Richmond", state: "VA", lat: 37.5407, lon: -77.4360, description: "Virginia's capital", population: 226610 },

  // Nebraska
  { id: "omaha", name: "Omaha", state: "NE", lat: 41.2565, lon: -95.9345, description: "Gateway to the West", population: 486051 },
  { id: "lincoln", name: "Lincoln", state: "NE", lat: 40.8258, lon: -96.6852, description: "Star City", population: 291082 },

  // Minnesota
  { id: "minneapolis", name: "Minneapolis", state: "MN", lat: 44.9778, lon: -93.2650, description: "City of Lakes", population: 429954 },
  { id: "saint-paul", name: "Saint Paul", state: "MN", lat: 44.9537, lon: -93.0900, description: "Minnesota's capital", population: 311527 },

  // Kansas
  { id: "wichita", name: "Wichita", state: "KS", lat: 37.6872, lon: -97.3301, description: "Air Capital of the World", population: 397532 },
  { id: "kansas-city-ks", name: "Kansas City", state: "KS", lat: 39.1155, lon: -94.6268, description: "Wyandotte County seat", population: 156607 },

  // Louisiana
  { id: "new-orleans", name: "New Orleans", state: "LA", lat: 29.9511, lon: -90.0715, description: "Jazz, food, and culture", population: 383997 },
  { id: "baton-rouge", name: "Baton Rouge", state: "LA", lat: 30.4515, lon: -91.1871, description: "Louisiana's capital", population: 227470 },

  // Hawaii
  { id: "honolulu", name: "Honolulu", state: "HI", lat: 21.3069, lon: -157.8583, description: "Island paradise", population: 350964 },

  // California (additional)
  { id: "chula-vista", name: "Chula Vista", state: "CA", lat: 32.6401, lon: -117.0842, description: "San Diego suburb", population: 275487 },
  { id: "fremont", name: "Fremont", state: "CA", lat: 37.5485, lon: -121.9886, description: "East Bay tech hub", population: 230504 },

  // Michigan
  { id: "detroit", name: "Detroit", state: "MI", lat: 42.3314, lon: -83.0458, description: "Motor City revival", population: 639111 },

  // New Jersey
  { id: "newark", name: "Newark", state: "NJ", lat: 40.7357, lon: -74.1724, description: "Brick City", population: 311549 },
  { id: "jersey-city", name: "Jersey City", state: "NJ", lat: 40.7178, lon: -74.0431, description: "NYC's neighbor", population: 292449 },

  // South Carolina
  { id: "charleston", name: "Charleston", state: "SC", lat: 32.7765, lon: -79.9311, description: "Historic coastal gem", population: 150227 },

  // Alabama
  { id: "birmingham", name: "Birmingham", state: "AL", lat: 33.5186, lon: -86.8104, description: "Magic City", population: 200733 },
  { id: "montgomery", name: "Montgomery", state: "AL", lat: 32.3792, lon: -86.3077, description: "Alabama's capital", population: 200603 },
  { id: "huntsville", name: "Huntsville", state: "AL", lat: 34.7304, lon: -86.5861, description: "Rocket City", population: 215006 },

  // Utah
  { id: "salt-lake-city", name: "Salt Lake City", state: "UT", lat: 40.7608, lon: -111.8910, description: "Gateway to the mountains", population: 199723 },

  // Alaska
  { id: "anchorage", name: "Anchorage", state: "AK", lat: 61.2181, lon: -149.9003, description: "Last Frontier's largest city", population: 291247 },

  // Iowa
  { id: "des-moines", name: "Des Moines", state: "IA", lat: 41.5868, lon: -93.6250, description: "Iowa's capital", population: 214133 },

  // Arkansas
  { id: "little-rock", name: "Little Rock", state: "AR", lat: 34.7465, lon: -92.2896, description: "Arkansas's capital", population: 202591 },

  // Idaho
  { id: "boise", name: "Boise", state: "ID", lat: 43.6150, lon: -116.2023, description: "City of Trees", population: 235684 },
];
