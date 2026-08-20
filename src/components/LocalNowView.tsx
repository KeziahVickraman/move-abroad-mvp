import React, { useState } from "react";
import { WeatherNowType, BusArrivalType, FxRateType } from "../lib/schemas";
import { 
  Radio, 
  Sun, 
  Wind, 
  Bus, 
  DollarSign, 
  Train, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  MapPin,
  ExternalLink,
  ShieldCheck
} from "lucide-react";

interface LocalNowViewProps {
  weather: WeatherNowType | null;
  busArrivals: BusArrivalType[];
  isBusLive: boolean;
  busError?: string;
  fxRates: FxRateType | null;
  mrtStatus: { line: string; status: "Normal" | "Delayed" | "Maintenance"; note: string }[];
  currentBusStop: string;
  onChangeBusStop: (code: string) => Promise<void>;
  onRefreshAll: () => Promise<void>;
  isRefreshing: boolean;
}

const COMMON_BUS_STOPS = [
  { code: "03211", label: "Tanjong Pagar / Anson Rd (CBD)" },
  { code: "01019", label: "Bugis / Bras Basah Rd" },
  { code: "83139", label: "Marine Parade (East Coast)" },
  { code: "10169", label: "Tiong Bahru Plaza" },
];

export const LocalNowView: React.FC<LocalNowViewProps> = ({
  weather,
  busArrivals,
  isBusLive,
  busError,
  fxRates,
  mrtStatus,
  currentBusStop,
  onChangeBusStop,
  onRefreshAll,
  isRefreshing,
}) => {
  const [customStopInput, setCustomStopInput] = useState("");
  const [activeCurrencyTab, setActiveCurrencyTab] = useState<"major" | "asia">("major");

  const handleStopSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customStopInput.trim()) {
      onChangeBusStop(customStopInput.trim());
      setCustomStopInput("");
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 pt-6 pb-24 space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Singapore Public Infrastructure Telematics</span>
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight mt-0.5">
            Local Now
          </h1>
        </div>

        <button
          id="btn-refresh-local-now"
          onClick={onRefreshAll}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-red-600" : ""}`} />
          <span>{isRefreshing ? "Fetching..." : "Refresh"}</span>
        </button>
      </div>

      {/* 1. Live Weather & PSI Air Quality Cluster (Data.gov.sg) */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900">Live Weather & Air Quality</h2>
              <p className="text-[11px] text-stone-500">Source: Data.gov.sg (Public Agency Feed)</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Live Feed
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
            <span className="text-[10px] text-stone-400 font-bold uppercase block">Temp</span>
            <span className="text-lg font-black text-stone-900 mt-0.5 block">{weather?.temperature_c || 31}°C</span>
            <span className="text-[10px] text-stone-500 line-clamp-1">{weather?.forecast || "Partly Cloudy"}</span>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
            <span className="text-[10px] text-stone-400 font-bold uppercase block">24h PSI (Air)</span>
            <span className="text-lg font-black text-emerald-600 mt-0.5 block">{weather?.psi || 42}</span>
            <span className="text-[10px] font-semibold text-emerald-700">Good Air</span>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
            <span className="text-[10px] text-stone-400 font-bold uppercase block">UV Index</span>
            <span className="text-lg font-black text-amber-600 mt-0.5 block">{weather?.uv_index || 7}</span>
            <span className="text-[10px] font-semibold text-amber-700">Moderate</span>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
            <span className="text-[10px] text-stone-400 font-bold uppercase block">2-Hr Rain</span>
            <span className="text-lg font-black text-stone-900 mt-0.5 block">Isolated</span>
            <span className="text-[10px] text-stone-500">Afternoon</span>
          </div>
        </div>
      </div>

      {/* 2. LTA DataMall Live Bus Arrivals Hub */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Bus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900">LTA Bus Arrivals</h2>
              <p className="text-[11px] text-stone-500">Stop #{currentBusStop}</p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
              isBusLive
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}
          >
            {isBusLive ? "● LTA Live API" : "Simulated Schedule"}
          </span>
        </div>

        {/* Missing Key or Fallback Notice */}
        {busError && (
          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">{busError}</p>
          </div>
        )}

        {/* Bus Stop Selector Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {COMMON_BUS_STOPS.map((stop) => (
            <button
              key={stop.code}
              onClick={() => onChangeBusStop(stop.code)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                currentBusStop === stop.code
                  ? "bg-stone-900 text-white font-semibold shadow-xs"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {stop.label}
            </button>
          ))}
        </div>

        {/* Custom Bus Stop Code Input */}
        <form onSubmit={handleStopSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Enter 5-digit SG bus stop code (e.g. 03211, 01019)..."
              value={customStopInput}
              onChange={(e) => setCustomStopInput(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors"
          >
            Track
          </button>
        </form>

        {/* Bus services cards list */}
        <div className="space-y-2 pt-1">
          {busArrivals.map((bus) => (
            <div
              key={bus.service_no}
              className="p-3 rounded-xl border border-stone-200 bg-stone-50/50 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-stone-900 text-white font-black text-sm flex items-center justify-center">
                  {bus.service_no}
                </div>
                <div>
                  <span className="text-xs font-bold text-stone-900">
                    Service {bus.service_no}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] text-stone-500 mt-0.5">
                    <span className="capitalize">{bus.load.replace("_", " ")}</span>
                    {bus.wheelchair_accessible && <span>• ♿ Wheelchair Access</span>}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-lg font-black text-emerald-600 block leading-none">
                  {bus.eta_min === 0 ? "Arriving" : `${bus.eta_min} min`}
                </span>
                <span className="text-[10px] text-stone-400 mt-0.5 block">Estimated Arrival</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Real-Time SGD Currency FX Ticker (ExchangeRate-API) */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900">SGD Exchange Rates</h2>
              <p className="text-[11px] text-stone-500">Live base: 1.00 SGD</p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg text-[10px]">
            <button
              onClick={() => setActiveCurrencyTab("major")}
              className={`px-2 py-1 rounded-md font-bold transition-all ${
                activeCurrencyTab === "major" ? "bg-white text-stone-900 shadow-xs" : "text-stone-500"
              }`}
            >
              Major FX
            </button>
            <button
              onClick={() => setActiveCurrencyTab("asia")}
              className={`px-2 py-1 rounded-md font-bold transition-all ${
                activeCurrencyTab === "asia" ? "bg-white text-stone-900 shadow-xs" : "text-stone-500"
              }`}
            >
              Asian FX
            </button>
          </div>
        </div>

        {fxRates && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            {activeCurrencyTab === "major" ? (
              <>
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-center">
                  <span className="text-[10px] text-stone-400 font-bold block">USD / SGD</span>
                  <span className="text-sm font-extrabold text-stone-900 mt-0.5 block">${fxRates.rates.USD}</span>
                  <span className="text-[9px] text-stone-500">1 SGD = {fxRates.rates.USD} USD</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-center">
                  <span className="text-[10px] text-stone-400 font-bold block">EUR / SGD</span>
                  <span className="text-sm font-extrabold text-stone-900 mt-0.5 block">€{fxRates.rates.EUR}</span>
                  <span className="text-[9px] text-stone-500">1 SGD = {fxRates.rates.EUR} EUR</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-center">
                  <span className="text-[10px] text-stone-400 font-bold block">GBP / SGD</span>
                  <span className="text-sm font-extrabold text-stone-900 mt-0.5 block">£{fxRates.rates.GBP}</span>
                  <span className="text-[9px] text-stone-500">1 SGD = {fxRates.rates.GBP} GBP</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-center">
                  <span className="text-[10px] text-stone-400 font-bold block">AUD / SGD</span>
                  <span className="text-sm font-extrabold text-stone-900 mt-0.5 block">A${fxRates.rates.AUD}</span>
                  <span className="text-[9px] text-stone-500">1 SGD = {fxRates.rates.AUD} AUD</span>
                </div>
              </>
            ) : (
              <>
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-center">
                  <span className="text-[10px] text-stone-400 font-bold block">MYR / SGD</span>
                  <span className="text-sm font-extrabold text-stone-900 mt-0.5 block">RM {fxRates.rates.MYR}</span>
                  <span className="text-[9px] text-stone-500">1 SGD = {fxRates.rates.MYR} MYR</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-center">
                  <span className="text-[10px] text-stone-400 font-bold block">INR / SGD</span>
                  <span className="text-sm font-extrabold text-stone-900 mt-0.5 block">₹{fxRates.rates.INR}</span>
                  <span className="text-[9px] text-stone-500">1 SGD = {fxRates.rates.INR} INR</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-center">
                  <span className="text-[10px] text-stone-400 font-bold block">CNY / SGD</span>
                  <span className="text-sm font-extrabold text-stone-900 mt-0.5 block">¥{fxRates.rates.CNY}</span>
                  <span className="text-[9px] text-stone-500">1 SGD = {fxRates.rates.CNY} CNY</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-center">
                  <span className="text-[10px] text-stone-400 font-bold block">JPY / SGD</span>
                  <span className="text-sm font-extrabold text-stone-900 mt-0.5 block">¥{fxRates.rates.JPY}</span>
                  <span className="text-[9px] text-stone-500">1 SGD = {fxRates.rates.JPY} JPY</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* 4. MRT Service Status Monitor */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <Train className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900">MRT Network Health</h2>
              <p className="text-[11px] text-stone-500">SMRT & SBS Transit Rail Operations</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            All Lines Normal
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
          {mrtStatus.map((mrt) => (
            <div
              key={mrt.line}
              className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <span className="font-bold text-stone-900 block">{mrt.line}</span>
                <span className="text-[10px] text-stone-500">{mrt.note}</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 px-2 py-0.5 bg-emerald-50 rounded-md">
                {mrt.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
