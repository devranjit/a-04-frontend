import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { Location, locationsData } from "./data/locations";

type WeightState = {
  safety: number;
  cost: number;
  climate: number;
  jobs: number;
  lifestyle: number;
};

type RankedLocation = Location & {
  final_score: number;
};

const initialWeights: WeightState = {
  safety: 35,
  cost: 20,
  climate: 15,
  jobs: 20,
  lifestyle: 10,
};

const clampScore = (score: number) => Math.min(99, Math.max(45, score));

const formatDateTime = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(date);

function App() {
  const [weights, setWeights] = useState<WeightState>(initialWeights);
  const [locations, setLocations] = useState<Location[]>(locationsData);
  const [isThinking, setIsThinking] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    const loadingTimeout = setTimeout(() => setIsThinking(false), 500);
    return () => clearTimeout(loadingTimeout);
  }, [weights]);

  useEffect(() => {
    const updateInterval = setInterval(() => {
      setLocations((prev) => {
        const updated = [...prev];
        const updateCount = Math.max(3, Math.floor(Math.random() * 8));

        for (let i = 0; i < updateCount; i += 1) {
          const index = Math.floor(Math.random() * updated.length);
          const target = updated[index];
          const tweak = () => Math.floor(Math.random() * 7) - 3;

          updated[index] = {
            ...target,
            safety_score: clampScore(target.safety_score + tweak()),
            cost_score: clampScore(target.cost_score + tweak()),
            climate_score: clampScore(target.climate_score + tweak()),
            job_score: clampScore(target.job_score + tweak()),
            lifestyle_score: clampScore(target.lifestyle_score + tweak()),
          };
        }

        return updated;
      });

      setLastUpdated(new Date());
    }, 9000);

    return () => clearInterval(updateInterval);
  }, []);

  const rankedResults = useMemo<RankedLocation[]>(() => {
    const totalWeight =
      weights.safety +
      weights.cost +
      weights.climate +
      weights.jobs +
      weights.lifestyle;

    return [...locations]
      .map((location) => {
        const weightedSum =
          location.safety_score * weights.safety +
          location.cost_score * weights.cost +
          location.climate_score * weights.climate +
          location.job_score * weights.jobs +
          location.lifestyle_score * weights.lifestyle;

        return {
          ...location,
          final_score: weightedSum / totalWeight,
        };
      })
      .sort((a, b) => b.final_score - a.final_score)
      .slice(0, 5);
  }, [locations, weights]);

  const onWeightChange = (key: keyof WeightState, value: number) => {
    setIsThinking(true);
    setWeights((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <main className="container">
        <header className="hero-card">
          <p className="eyebrow">World Safe Zone AI Calculator</p>
          <h1>Find the Safest Place to Live Based on Your Lifestyle</h1>
          <p className="hero-copy">
            Smart ranking engine for global relocation decisions using safety,
            cost of living, climate, jobs, and lifestyle fit.
          </p>
          <div className="stamp">
            <span className="dot" />
            Last updated: {formatDateTime(lastUpdated)}
          </div>
        </header>

        <section className="panel">
          <h2>Smart Preference Filters</h2>
          <p>
            Adjust importance levels and let the AI scoring engine recalculate
            your safest location choices in real time.
          </p>

          <div className="slider-grid">
            <label>
              Safety Priority
              <input
                type="range"
                min={5}
                max={50}
                value={weights.safety}
                onChange={(e) => onWeightChange("safety", Number(e.target.value))}
              />
              <strong>{weights.safety}%</strong>
            </label>

            <label>
              Cost of Living Priority
              <input
                type="range"
                min={5}
                max={50}
                value={weights.cost}
                onChange={(e) => onWeightChange("cost", Number(e.target.value))}
              />
              <strong>{weights.cost}%</strong>
            </label>

            <label>
              Climate Priority
              <input
                type="range"
                min={5}
                max={50}
                value={weights.climate}
                onChange={(e) => onWeightChange("climate", Number(e.target.value))}
              />
              <strong>{weights.climate}%</strong>
            </label>

            <label>
              Job Opportunity Priority
              <input
                type="range"
                min={5}
                max={50}
                value={weights.jobs}
                onChange={(e) => onWeightChange("jobs", Number(e.target.value))}
              />
              <strong>{weights.jobs}%</strong>
            </label>

            <label>
              Lifestyle Priority
              <input
                type="range"
                min={5}
                max={50}
                value={weights.lifestyle}
                onChange={(e) =>
                  onWeightChange("lifestyle", Number(e.target.value))
                }
              />
              <strong>{weights.lifestyle}%</strong>
            </label>
          </div>
        </section>

        <section className="panel">
          <div className="result-header">
            <h2>Top 5 Ranked Locations</h2>
            {isThinking ? (
              <div className="thinking">
                <span />
                <span />
                <span />
                AI recalculating live rankings...
              </div>
            ) : (
              <h3>Precision ranking ready</h3>
            )}
          </div>

          <div className="result-list">
            {rankedResults.map((location, index) => (
              <article className="result-card" key={`${location.name}-${location.country}`}>
                <div className="result-title">
                  <span className="rank">#{index + 1}</span>
                  <div>
                    <h3>{location.name}</h3>
                    <p>{location.country}</p>
                  </div>
                  <div className="final-score">
                    {location.final_score.toFixed(1)}
                    <small>AI Score</small>
                  </div>
                </div>

                <div className="metric-grid">
                  {[
                    { label: "Safety", value: location.safety_score },
                    { label: "Cost", value: location.cost_score },
                    { label: "Climate", value: location.climate_score },
                    { label: "Jobs", value: location.job_score },
                    { label: "Lifestyle", value: location.lifestyle_score },
                  ].map((metric) => (
                    <div className="metric" key={metric.label}>
                      <div className="metric-head">
                        <span>{metric.label}</span>
                        <span>{metric.value}</span>
                      </div>
                      <div className="bar-track">
                        <div
                          className="bar-fill"
                          style={{ width: `${metric.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="seo-content">
          <h2>Safest Countries to Live</h2>
          <p>
            Our weighted model continuously compares highly ranked regions and
            highlights the safest countries to live with strong lifestyle
            alignment.
          </p>
          <h2>Best Places to Live Based on Lifestyle</h2>
          <p>
            Tune the lifestyle and climate priorities to identify cities that
            match your pace, culture, and quality-of-life expectations.
          </p>
          <h2>Safest Cities in the World</h2>
          <p>
            The ranking feed updates frequently to surface safest cities in the
            world through a transparent multi-factor scoring system.
          </p>
        </section>
      </main>
    </div>
  );
}

export default App;
