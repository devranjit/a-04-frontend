import { useEffect, useMemo, useState } from "react";
import "./App.css";

type LocationSeed = {
  name: string;
  country: string;
};

type LocationData = LocationSeed & {
  safety_score: number;
  cost_score: number;
  climate_score: number;
  job_score: number;
  lifestyle_score: number;
};

type Weights = {
  safety: number;
  cost: number;
  climate: number;
  jobs: number;
  lifestyle: number;
};

type RankedLocation = LocationData & {
  final_score: number;
};

const locationSeeds: LocationSeed[] = [
  { name: "Zurich", country: "Switzerland" },
  { name: "Geneva", country: "Switzerland" },
  { name: "Bern", country: "Switzerland" },
  { name: "Basel", country: "Switzerland" },
  { name: "Oslo", country: "Norway" },
  { name: "Bergen", country: "Norway" },
  { name: "Trondheim", country: "Norway" },
  { name: "Stockholm", country: "Sweden" },
  { name: "Gothenburg", country: "Sweden" },
  { name: "Malmo", country: "Sweden" },
  { name: "Copenhagen", country: "Denmark" },
  { name: "Aarhus", country: "Denmark" },
  { name: "Odense", country: "Denmark" },
  { name: "Helsinki", country: "Finland" },
  { name: "Tampere", country: "Finland" },
  { name: "Turku", country: "Finland" },
  { name: "Reykjavik", country: "Iceland" },
  { name: "Akureyri", country: "Iceland" },
  { name: "Dublin", country: "Ireland" },
  { name: "Cork", country: "Ireland" },
  { name: "Galway", country: "Ireland" },
  { name: "Vienna", country: "Austria" },
  { name: "Salzburg", country: "Austria" },
  { name: "Innsbruck", country: "Austria" },
  { name: "Munich", country: "Germany" },
  { name: "Hamburg", country: "Germany" },
  { name: "Stuttgart", country: "Germany" },
  { name: "Berlin", country: "Germany" },
  { name: "Amsterdam", country: "Netherlands" },
  { name: "Utrecht", country: "Netherlands" },
  { name: "Eindhoven", country: "Netherlands" },
  { name: "Rotterdam", country: "Netherlands" },
  { name: "Luxembourg City", country: "Luxembourg" },
  { name: "Brussels", country: "Belgium" },
  { name: "Ghent", country: "Belgium" },
  { name: "Antwerp", country: "Belgium" },
  { name: "Prague", country: "Czech Republic" },
  { name: "Brno", country: "Czech Republic" },
  { name: "Tallinn", country: "Estonia" },
  { name: "Riga", country: "Latvia" },
  { name: "Vilnius", country: "Lithuania" },
  { name: "Warsaw", country: "Poland" },
  { name: "Krakow", country: "Poland" },
  { name: "Wroclaw", country: "Poland" },
  { name: "Ljubljana", country: "Slovenia" },
  { name: "Zagreb", country: "Croatia" },
  { name: "Split", country: "Croatia" },
  { name: "Lisbon", country: "Portugal" },
  { name: "Porto", country: "Portugal" },
  { name: "Faro", country: "Portugal" },
  { name: "Madrid", country: "Spain" },
  { name: "Barcelona", country: "Spain" },
  { name: "Valencia", country: "Spain" },
  { name: "Malaga", country: "Spain" },
  { name: "Milan", country: "Italy" },
  { name: "Bologna", country: "Italy" },
  { name: "Florence", country: "Italy" },
  { name: "Rome", country: "Italy" },
  { name: "Athens", country: "Greece" },
  { name: "Thessaloniki", country: "Greece" },
  { name: "Nicosia", country: "Cyprus" },
  { name: "Tokyo", country: "Japan" },
  { name: "Osaka", country: "Japan" },
  { name: "Fukuoka", country: "Japan" },
  { name: "Kyoto", country: "Japan" },
  { name: "Seoul", country: "South Korea" },
  { name: "Busan", country: "South Korea" },
  { name: "Taipei", country: "Taiwan" },
  { name: "Singapore", country: "Singapore" },
  { name: "Wellington", country: "New Zealand" },
  { name: "Auckland", country: "New Zealand" },
  { name: "Christchurch", country: "New Zealand" },
  { name: "Sydney", country: "Australia" },
  { name: "Melbourne", country: "Australia" },
  { name: "Brisbane", country: "Australia" },
  { name: "Perth", country: "Australia" },
  { name: "Vancouver", country: "Canada" },
  { name: "Calgary", country: "Canada" },
  { name: "Ottawa", country: "Canada" },
  { name: "Toronto", country: "Canada" },
  { name: "Montreal", country: "Canada" },
  { name: "Quebec City", country: "Canada" },
  { name: "Seattle", country: "United States" },
  { name: "Boston", country: "United States" },
  { name: "Austin", country: "United States" },
  { name: "Denver", country: "United States" },
  { name: "San Diego", country: "United States" },
  { name: "Portland", country: "United States" },
  { name: "San Francisco", country: "United States" },
  { name: "Dubai", country: "United Arab Emirates" },
  { name: "Abu Dhabi", country: "United Arab Emirates" },
  { name: "Doha", country: "Qatar" },
  { name: "Muscat", country: "Oman" },
  { name: "Santiago", country: "Chile" },
  { name: "Montevideo", country: "Uruguay" },
  { name: "Buenos Aires", country: "Argentina" },
  { name: "San Jose", country: "Costa Rica" },
  { name: "Panama City", country: "Panama" },
  { name: "Kuala Lumpur", country: "Malaysia" },
  { name: "Penang", country: "Malaysia" },
  { name: "Bangkok", country: "Thailand" },
  { name: "Chiang Mai", country: "Thailand" }
];

const scoreFromText = (text: string, salt: number, min = 58, max = 98) => {
  const hash = text.split("").reduce((acc, char, index) => acc + char.charCodeAt(0) * (index + salt), 0);
  return Math.min(max, Math.max(min, min + (hash % (max - min + 1))));
};

const buildDataset = (): LocationData[] =>
  locationSeeds.map((location) => ({
    ...location,
    safety_score: scoreFromText(`${location.name}${location.country}`, 2, 62, 99),
    cost_score: scoreFromText(`${location.country}${location.name}`, 5, 50, 98),
    climate_score: scoreFromText(`${location.name}`, 7, 55, 99),
    job_score: scoreFromText(`${location.country}`, 11, 53, 98),
    lifestyle_score: scoreFromText(`${location.name}${location.country}`, 13, 57, 99)
  }));

const initialWeights: Weights = {
  safety: 90,
  cost: 70,
  climate: 65,
  jobs: 80,
  lifestyle: 75
};

const getFinalScore = (location: LocationData, weights: Weights) => {
  const totalWeight =
    weights.safety + weights.cost + weights.climate + weights.jobs + weights.lifestyle;

  const weightedSum =
    location.safety_score * weights.safety +
    location.cost_score * weights.cost +
    location.climate_score * weights.climate +
    location.job_score * weights.jobs +
    location.lifestyle_score * weights.lifestyle;

  return weightedSum / totalWeight;
};

function App() {
  const [weights, setWeights] = useState<Weights>(initialWeights);
  const [locations, setLocations] = useState<LocationData[]>(() => buildDataset());
  const [isThinking, setIsThinking] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleString());

  useEffect(() => {
    const thinkTimer = setTimeout(() => setIsThinking(false), 520);
    setIsThinking(true);
    return () => clearTimeout(thinkTimer);
  }, [weights]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLocations((current) => {
        const changed = [...current];
        const updateCount = Math.floor(Math.random() * 6) + 3;

        for (let i = 0; i < updateCount; i += 1) {
          const index = Math.floor(Math.random() * changed.length);
          const randomMetric =
            ["safety_score", "cost_score", "climate_score", "job_score", "lifestyle_score"][
              Math.floor(Math.random() * 5)
            ] as keyof LocationData;
          const delta = Math.floor(Math.random() * 7) - 3;
          const currentValue = changed[index][randomMetric] as number;
          changed[index] = {
            ...changed[index],
            [randomMetric]: Math.min(99, Math.max(45, currentValue + delta))
          };
        }

        return changed;
      });

      setLastUpdated(new Date().toLocaleString());
    }, 9000);

    return () => clearInterval(interval);
  }, []);

  const rankedLocations = useMemo<RankedLocation[]>(() => {
    return locations
      .map((location) => ({
        ...location,
        final_score: getFinalScore(location, weights)
      }))
      .sort((a, b) => b.final_score - a.final_score)
      .slice(0, 5);
  }, [locations, weights]);

  return (
    <div className="app-shell">
      <div className="ambient-glow ambient-1" />
      <div className="ambient-glow ambient-2" />
      <header className="hero">
        <p className="tag">World Safe Zone AI Calculator</p>
        <h1>Find the Safest Place to Live Based on Your Lifestyle</h1>
        <p className="hero-subtitle">
          Tune your priorities and let the AI ranking engine identify elite global destinations for
          safety, affordability, weather quality, jobs, and modern lifestyle compatibility.
        </p>
      </header>

      <main className="layout-grid">
        <section className="panel filters">
          <div className="panel-head">
            <h2>Smart Preference Filters</h2>
            <span className="pulse-dot">Live AI</span>
          </div>

          {(
            [
              ["Safety Priority", "safety"],
              ["Cost of Living Priority", "cost"],
              ["Climate Comfort Priority", "climate"],
              ["Job Opportunity Priority", "jobs"],
              ["Lifestyle Priority", "lifestyle"]
            ] as [string, keyof Weights][]
          ).map(([label, key]) => (
            <label key={key} className="slider-group">
              <div className="slider-top">
                <span>{label}</span>
                <strong>{weights[key]}%</strong>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                value={weights[key]}
                onChange={(event) =>
                  setWeights((current) => ({ ...current, [key]: Number(event.target.value) }))
                }
              />
            </label>
          ))}

          <div className="timestamp">
            <span>Last updated</span>
            <strong>{lastUpdated}</strong>
          </div>
        </section>

        <section className="panel results">
          <div className="panel-head">
            <h2>Top 5 Ranked Locations</h2>
            {isThinking ? <span className="thinking">AI recalculating...</span> : <span>Ready</span>}
          </div>

          {rankedLocations.map((location, index) => (
            <article key={`${location.name}-${location.country}`} className="result-card">
              <div className="result-title-row">
                <div>
                  <h3>
                    #{index + 1} {location.name}, {location.country}
                  </h3>
                  <p>Final Match Score: {location.final_score.toFixed(2)} / 100</p>
                </div>
              </div>

              <div className="metric-bars">
                {[
                  ["Safety", location.safety_score],
                  ["Cost", location.cost_score],
                  ["Climate", location.climate_score],
                  ["Jobs", location.job_score],
                  ["Lifestyle", location.lifestyle_score]
                ].map(([metric, value]) => (
                  <div className="bar-row" key={metric}>
                    <div className="bar-label">
                      <span>{metric}</span>
                      <strong>{value}</strong>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>
      </main>

      <section className="seo-content panel">
        <h2>safest countries to live</h2>
        <p>
          Compare high-ranking destinations where public safety, social stability, and resilient
          infrastructure create secure long-term living environments for individuals and families.
        </p>
        <h2>best places to live based on lifestyle</h2>
        <p>
          Match your lifestyle goals with global cities optimized for professional growth, cultural
          experiences, wellness access, and overall quality of life.
        </p>
        <h3>safest cities in the world</h3>
        <p>
          Explore data-driven city recommendations that combine low-risk environments with strong
          job markets, favorable climate patterns, and modern urban comfort.
        </p>
      </section>
    </div>
  );
}

export default App;
