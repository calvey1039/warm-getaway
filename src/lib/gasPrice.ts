// Gas Price API service
// Uses EIA (Energy Information Administration) open data API

const DEFAULT_GAS_PRICE = 2.93; // Fallback price in USD per gallon

export interface GasPriceData {
  price: number;
  date: string;
  source: string;
}

// Fetch current US average gas price from EIA
export async function fetchCurrentGasPrice(): Promise<GasPriceData> {
  try {
    // EIA API endpoint for weekly retail gasoline prices
    // This is the US regular conventional retail gasoline prices
    const response = await fetch(
      "https://api.eia.gov/v2/petroleum/pri/gnd/data/?api_key=DEMO_KEY&frequency=weekly&data[0]=value&facets[series][]=EMM_EPMR_PTE_NUS_DPG&sort[0][column]=period&sort[0][direction]=desc&length=1",
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      throw new Error("Failed to fetch gas price");
    }

    const data = await response.json();

    if (data.response?.data?.[0]?.value) {
      return {
        price: parseFloat(data.response.data[0].value),
        date: data.response.data[0].period,
        source: "EIA",
      };
    }

    throw new Error("No data in response");
  } catch (error) {
    console.error("Gas price fetch error:", error);
    // Return default price as fallback
    return {
      price: DEFAULT_GAS_PRICE,
      date: new Date().toISOString().split("T")[0],
      source: "default",
    };
  }
}

// Format gas price for display
export function formatGasPrice(price: number): string {
  return `$${price.toFixed(2)}/gal`;
}
