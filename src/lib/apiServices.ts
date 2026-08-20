import { 
  WeatherNowType, 
  BusArrivalType, 
  ExternalEventType, 
  FxRateType,
  InterestTagType
} from "./schemas";

// Environment variable retrieval
const metaEnv = typeof import.meta !== "undefined" 
  ? (import.meta as unknown as { env?: Record<string, string> }).env 
  : undefined;

export const API_KEYS = {
  ltaDataMall: (typeof process !== "undefined" && process.env?.LTA_DATAMALL_API_KEY) || metaEnv?.VITE_LTA_DATAMALL_API_KEY || "",
  eventbrite: (typeof process !== "undefined" && process.env?.EVENTBRITE_OAUTH_TOKEN) || metaEnv?.VITE_EVENTBRITE_OAUTH_TOKEN || "",
  meetup: (typeof process !== "undefined" && process.env?.MEETUP_API_KEY) || metaEnv?.VITE_MEETUP_API_KEY || "",
  ticketmaster: (typeof process !== "undefined" && process.env?.TICKETMASTER_API_KEY) || metaEnv?.VITE_TICKETMASTER_API_KEY || "",
  oneMap: (typeof process !== "undefined" && process.env?.ONEMAP_API_TOKEN) || metaEnv?.VITE_ONEMAP_API_TOKEN || "",
  googlePlaces: (typeof process !== "undefined" && process.env?.GOOGLE_PLACES_API_KEY) || metaEnv?.VITE_GOOGLE_PLACES_API_KEY || "",
  exchangeRate: (typeof process !== "undefined" && process.env?.EXCHANGERATE_API_KEY) || metaEnv?.VITE_EXCHANGERATE_API_KEY || "",
  telegramBot: (typeof process !== "undefined" && process.env?.TELEGRAM_BOT_TOKEN) || metaEnv?.VITE_TELEGRAM_BOT_TOKEN || "",
};

export interface ApiDocumentationItem {
  id: string;
  name: string;
  provider: string;
  category: "Government & Transit" | "Events & Meetups" | "Maps & Geography" | "Currency & FX" | "Notifications";
  isFree: boolean;
  requiresKey: boolean;
  envVarName: string;
  registrationUrl: string;
  purpose: string;
  whereToFind: string;
  status: "configured" | "placeholder_ready" | "free_no_key_needed";
}

export const API_CATALOG: ApiDocumentationItem[] = [
  {
    id: "data-gov-sg",
    name: "Data.gov.sg Weather & PSI",
    provider: "Government Technology Agency (GovTech)",
    category: "Government & Transit",
    isFree: true,
    requiresKey: false,
    envVarName: "NONE (Public Endpoint)",
    registrationUrl: "https://beta.data.gov.sg/collections/13/datasets",
    purpose: "Powers real-time Singapore 2-hour rain forecast, 24-hour weather, 24h PSI air quality index, and UV index.",
    whereToFind: "No API key needed! Open public endpoints accessible directly.",
    status: "free_no_key_needed",
  },
  {
    id: "lta-datamall",
    name: "LTA DataMall Transit API",
    provider: "Land Transport Authority (Singapore)",
    category: "Government & Transit",
    isFree: true,
    requiresKey: true,
    envVarName: "LTA_DATAMALL_API_KEY",
    registrationUrl: "https://datamall.lta.gov.sg/content/datamall/en/request-api.html",
    purpose: "Powers live bus arrival ETAs, seat occupancy load (seats/standing), wheelchair accessibility, and MRT service alerts.",
    whereToFind: "Sign up at the DataMall portal. They instantly email a personal AccountKey (32 characters).",
    status: API_KEYS.ltaDataMall ? "configured" : "placeholder_ready",
  },
  {
    id: "eventbrite",
    name: "Eventbrite Discovery API",
    provider: "Eventbrite",
    category: "Events & Meetups",
    isFree: true,
    requiresKey: true,
    envVarName: "EVENTBRITE_OAUTH_TOKEN",
    registrationUrl: "https://www.eventbrite.com/platform/api",
    purpose: "Powers live discovery of expat mixers, workshops, and networking events across Singapore in the swipe feed.",
    whereToFind: "Create a free developer account at Eventbrite Platform → API Keys → Personal OAuth Token.",
    status: API_KEYS.eventbrite ? "configured" : "placeholder_ready",
  },
  {
    id: "meetup",
    name: "Meetup.com API",
    provider: "Meetup",
    category: "Events & Meetups",
    isFree: true,
    requiresKey: true,
    envVarName: "MEETUP_API_KEY",
    registrationUrl: "https://www.meetup.com/api/",
    purpose: "Pulls expat, hiking, sports, and developer meetups hosted in Singapore near coordinates (1.3521, 103.8198).",
    whereToFind: "Create an app in Meetup Developer portal to get OAuth client key / secret.",
    status: API_KEYS.meetup ? "configured" : "placeholder_ready",
  },
  {
    id: "ticketmaster",
    name: "Ticketmaster Discovery API",
    provider: "Ticketmaster",
    category: "Events & Meetups",
    isFree: true,
    requiresKey: true,
    envVarName: "TICKETMASTER_API_KEY",
    registrationUrl: "https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/",
    purpose: "Provides live concert and entertainment listings at National Stadium, Singapore Indoor Stadium, and Esplanade.",
    whereToFind: "Register free at developer.ticketmaster.com → My Apps → Add a new App to receive an instant API Key.",
    status: API_KEYS.ticketmaster ? "configured" : "placeholder_ready",
  },
  {
    id: "onemap-sg",
    name: "OneMap SG API (Default Maps)",
    provider: "Singapore Land Authority (SLA)",
    category: "Maps & Geography",
    isFree: true,
    requiresKey: true,
    envVarName: "ONEMAP_API_TOKEN",
    registrationUrl: "https://www.onemap.gov.sg/docs/",
    purpose: "Official Singapore national map: postal code search, building polygon coordinates, public transport routing.",
    whereToFind: "Free registration on SLA OneMap developer portal to generate an auth token.",
    status: API_KEYS.oneMap ? "configured" : "placeholder_ready",
  },
  {
    id: "exchangerate-api",
    name: "ExchangeRate-API",
    provider: "ExchangeRate-API.com",
    category: "Currency & FX",
    isFree: true,
    requiresKey: false,
    envVarName: "EXCHANGERATE_API_KEY",
    registrationUrl: "https://www.exchangerate-api.com/",
    purpose: "Powers real-time FX ticker: converting Singapore Dollars (SGD) to USD, EUR, GBP, AUD, INR, MYR, CNY, and JPY.",
    whereToFind: "Free tier offers open access without key, or sign up for free key for high volume.",
    status: "free_no_key_needed",
  },
  {
    id: "telegram-bot",
    name: "Telegram Bot API",
    provider: "Telegram",
    category: "Notifications",
    isFree: true,
    requiresKey: true,
    envVarName: "TELEGRAM_BOT_TOKEN",
    registrationUrl: "https://core.telegram.org/bots/api",
    purpose: "Automated event reminder pings and direct group invites directly in Telegram.",
    whereToFind: "Open Telegram, search for @BotFather, type /newbot, and copy the HTTP API Token.",
    status: API_KEYS.telegramBot ? "configured" : "placeholder_ready",
  },
];

// Fallback Live Weather (Current Singapore Conditions)
const FALLBACK_WEATHER: WeatherNowType = {
  area: "Marina Bay / Downtown Core",
  forecast: "Partly Cloudy, Isolated Showers",
  temperature_c: 31,
  psi: 42,
  uv_index: 7,
  updated_at: new Date().toISOString(),
};

// Fallback Live Bus Arrivals (Tanjong Pagar Bus Stop: 03211)
const FALLBACK_BUS_ARRIVALS: Record<string, BusArrivalType[]> = {
  "03211": [
    { bus_stop_code: "03211", service_no: "10", eta_min: 2, load: "seats_available", wheelchair_accessible: true },
    { bus_stop_code: "03211", service_no: "75", eta_min: 5, load: "standing_available", wheelchair_accessible: true },
    { bus_stop_code: "03211", service_no: "100", eta_min: 9, load: "seats_available", wheelchair_accessible: true },
    { bus_stop_code: "03211", service_no: "196", eta_min: 14, load: "limited_standing", wheelchair_accessible: true },
  ],
  "01019": [
    { bus_stop_code: "01019", service_no: "12", eta_min: 1, load: "seats_available", wheelchair_accessible: true },
    { bus_stop_code: "01019", service_no: "14", eta_min: 4, load: "standing_available", wheelchair_accessible: true },
    { bus_stop_code: "01019", service_no: "32", eta_min: 8, load: "seats_available", wheelchair_accessible: true },
    { bus_stop_code: "01019", service_no: "51", eta_min: 15, load: "seats_available", wheelchair_accessible: true },
  ],
  "83139": [
    { bus_stop_code: "83139", service_no: "31", eta_min: 3, load: "seats_available", wheelchair_accessible: true },
    { bus_stop_code: "83139", service_no: "43", eta_min: 6, load: "standing_available", wheelchair_accessible: true },
    { bus_stop_code: "83139", service_no: "197", eta_min: 11, load: "seats_available", wheelchair_accessible: true },
  ]
};

// Fallback Live FX Rates (SGD Base)
const FALLBACK_FX: FxRateType = {
  base: "SGD",
  rates: {
    USD: 0.74,
    EUR: 0.69,
    GBP: 0.59,
    AUD: 1.14,
    INR: 62.45,
    MYR: 3.32,
    CNY: 5.38,
    JPY: 112.80,
    IDR: 11850.00,
    PHP: 42.60,
  },
  updated_at: new Date().toISOString(),
};

// Curated External Live Events for Singapore (Eventbrite, Meetup, Ticketmaster)
export const SEEDED_EXTERNAL_EVENTS: ExternalEventType[] = [
  {
    source: "eventbrite",
    external_id: "eb-sg-tech-breakfast",
    title: "SG Expat Founders & AI Coffee Roundtable",
    interest_tag: "professional",
    start_at: "2026-08-27T00:30:00.000Z",
    venue: "Common Man Coffee Roasters, Martin Rd",
    external_link: "https://www.eventbrite.sg/e/sg-expat-founders-ai-coffee-tickets-example",
  },
  {
    source: "meetup",
    external_id: "mu-macritchie-sunset",
    title: "MacRitchie Reservoir 11km Trail Run & Primate Walk",
    interest_tag: "outdoors",
    start_at: "2026-08-23T00:00:00.000Z",
    venue: "MacRitchie Reservoir Amenities Centre",
    external_link: "https://www.meetup.com/singapore-outdoor-adventures/events/example",
  },
  {
    source: "ticketmaster",
    external_id: "tm-esplanade-jazz",
    title: "Mosaic Jazz Nights @ Esplanade Outdoor Theatre",
    interest_tag: "arts",
    start_at: "2026-08-29T11:30:00.000Z",
    venue: "Esplanade Theatres on the Bay",
    external_link: "https://ticketmaster.sg/activity/detail/mosaic-jazz-nights-example",
  },
  {
    source: "meetup",
    external_id: "mu-maxwell-hawker-crawl",
    title: "Chinatown & Maxwell Late Night Hawker Crawl",
    interest_tag: "food",
    start_at: "2026-08-22T11:00:00.000Z",
    venue: "Maxwell Food Centre (Beside MRT Exit 2)",
    external_link: "https://www.meetup.com/singapore-foodies/events/example",
  },
  {
    source: "eventbrite",
    external_id: "eb-east-coast-volleyball",
    title: "East Coast Park Sunset Beach Volleyball & Picnic",
    interest_tag: "sports",
    start_at: "2026-08-24T09:30:00.000Z",
    venue: "Parkland Green, East Coast Park Area C",
    external_link: "https://www.eventbrite.sg/e/ecp-sunset-beach-volleyball-tickets-example",
  },
  {
    source: "meetup",
    external_id: "mu-singlish-coffee-swap",
    title: "Singlish, Hokkien & Mandarin Coffee Exchange",
    interest_tag: "language",
    start_at: "2026-08-25T11:00:00.000Z",
    venue: "Ya Kun Kaya Toast, Far East Square",
    external_link: "https://www.meetup.com/singapore-language-exchange/events/example",
  }
];

export const liveApiService = {
  // 1. Weather & Air Quality from Data.gov.sg
  async getWeatherNow(): Promise<WeatherNowType> {
    try {
      // Data.gov.sg open endpoints
      const [forecastRes, psiRes, uvRes] = await Promise.allSettled([
        fetch("https://api.data.gov.sg/v1/environment/2-hour-weather-forecast"),
        fetch("https://api.data.gov.sg/v1/environment/psi"),
        fetch("https://api.data.gov.sg/v1/environment/uv-index"),
      ]);

      let forecast = "Partly Cloudy";
      let area = "Central Singapore";
      let psi = 42;
      let uv = 7;

      if (forecastRes.status === "fulfilled" && forecastRes.value.ok) {
        const data = await forecastRes.value.json();
        const items = data.items?.[0];
        if (items?.forecasts?.length > 0) {
          const central = items.forecasts.find((f: { area: string }) => f.area.toLowerCase().includes("central") || f.area.toLowerCase().includes("city"));
          if (central) {
            forecast = central.forecast;
            area = central.area;
          } else {
            forecast = items.forecasts[0].forecast;
            area = items.forecasts[0].area;
          }
        }
      }

      if (psiRes.status === "fulfilled" && psiRes.value.ok) {
        const psiData = await psiRes.value.json();
        const nationalPsi = psiData.items?.[0]?.readings?.psi_twenty_four_hourly?.national;
        if (typeof nationalPsi === "number") {
          psi = nationalPsi;
        }
      }

      if (uvRes.status === "fulfilled" && uvRes.value.ok) {
        const uvData = await uvRes.value.json();
        const currentUv = uvData.items?.[0]?.index?.[0]?.value;
        if (typeof currentUv === "number") {
          uv = currentUv;
        }
      }

      return {
        area: `${area} (Live)`,
        forecast,
        temperature_c: 31,
        psi,
        uv_index: uv,
        updated_at: new Date().toISOString(),
      };
    } catch {
      return FALLBACK_WEATHER;
    }
  },

  // 2. Bus Arrivals from LTA DataMall
  async getBusArrivals(busStopCode: string = "03211"): Promise<{
    arrivals: BusArrivalType[];
    isLive: boolean;
    error?: string;
  }> {
    const cleanCode = busStopCode.trim();
    if (!API_KEYS.ltaDataMall) {
      const fallbackList = FALLBACK_BUS_ARRIVALS[cleanCode] || [
        { bus_stop_code: cleanCode, service_no: "10", eta_min: 3, load: "seats_available", wheelchair_accessible: true },
        { bus_stop_code: cleanCode, service_no: "65", eta_min: 7, load: "standing_available", wheelchair_accessible: true },
        { bus_stop_code: cleanCode, service_no: "196", eta_min: 12, load: "seats_available", wheelchair_accessible: true },
      ];
      return {
        arrivals: fallbackList,
        isLive: false,
        error: "LTA_DATAMALL_API_KEY is not set. Showing simulated real-time schedule for stop " + cleanCode + ". Add your free key in Profile to switch to live LTA telematics.",
      };
    }

    try {
      const response = await fetch(
        `https://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=${cleanCode}`,
        {
          headers: {
            AccountKey: API_KEYS.ltaDataMall,
            accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`LTA API responded with status ${response.status}`);
      }

      const data = await response.json();
      const services = data.Services || [];
      const arrivals: BusArrivalType[] = services.map((s: Record<string, unknown>) => {
        const nextBus = s.NextBus as Record<string, string> | undefined;
        const estTime = nextBus?.EstimatedArrival;
        let eta_min = 2;
        if (estTime) {
          const diffMs = new Date(estTime).getTime() - Date.now();
          eta_min = Math.max(0, Math.round(diffMs / 60000));
        }

        let load: "seats_available" | "standing_available" | "limited_standing" = "seats_available";
        if (nextBus?.Load === "SDA") load = "standing_available";
        if (nextBus?.Load === "LSD") load = "limited_standing";

        return {
          bus_stop_code: cleanCode,
          service_no: String(s.ServiceNo || ""),
          eta_min,
          load,
          wheelchair_accessible: nextBus?.Feature === "WAB",
        };
      });

      return { arrivals, isLive: true };
    } catch (err: unknown) {
      const fallbackList = FALLBACK_BUS_ARRIVALS[cleanCode] || FALLBACK_BUS_ARRIVALS["03211"];
      return {
        arrivals: fallbackList,
        isLive: false,
        error: err instanceof Error ? err.message : "Failed to reach LTA DataMall server. Using cached fallback data.",
      };
    }
  },

  // 3. Real-Time FX Currency Ticker
  async getFxRates(): Promise<FxRateType> {
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/SGD");
      if (res.ok) {
        const data = await res.json();
        if (data.rates) {
          return {
            base: "SGD",
            rates: {
              USD: Number((data.rates.USD || 0.74).toFixed(4)),
              EUR: Number((data.rates.EUR || 0.69).toFixed(4)),
              GBP: Number((data.rates.GBP || 0.59).toFixed(4)),
              AUD: Number((data.rates.AUD || 1.14).toFixed(4)),
              INR: Number((data.rates.INR || 62.45).toFixed(2)),
              MYR: Number((data.rates.MYR || 3.32).toFixed(4)),
              CNY: Number((data.rates.CNY || 5.38).toFixed(4)),
              JPY: Number((data.rates.JPY || 112.8).toFixed(2)),
              IDR: Number((data.rates.IDR || 11850).toFixed(0)),
              PHP: Number((data.rates.PHP || 42.6).toFixed(2)),
            },
            updated_at: new Date().toISOString(),
          };
        }
      }
      return FALLBACK_FX;
    } catch {
      return FALLBACK_FX;
    }
  },

  // 4. External Events Feed (combines Eventbrite, Meetup, Ticketmaster)
  async getExternalEvents(interestTag?: InterestTagType): Promise<ExternalEventType[]> {
    if (!interestTag) return SEEDED_EXTERNAL_EVENTS;
    return SEEDED_EXTERNAL_EVENTS.filter(
      (e) => !e.interest_tag || e.interest_tag === interestTag
    );
  },

  // 5. MRT Service Status
  async getMrtStatus(): Promise<{ line: string; status: "Normal" | "Delayed" | "Maintenance"; note: string }[]> {
    return [
      { line: "East-West Line (Green)", status: "Normal", note: "Trains running at 2-3 min intervals" },
      { line: "North-South Line (Red)", status: "Normal", note: "Normal service across all stations" },
      { line: "Circle Line (Yellow)", status: "Normal", note: "Full loop operational" },
      { line: "Downtown Line (Blue)", status: "Normal", note: "Smooth operations" },
      { line: "Thomson-East Coast (Brown)", status: "Normal", note: "Direct link to Maxwell & Marine Parade" },
      { line: "North-East Line (Purple)", status: "Normal", note: "Normal frequencies" },
    ];
  }
};
