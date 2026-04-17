import { useMemo, useState } from "react";

const MIN_RADIUS = 0.1;
const MIN_PHASE = 0;
const MAX_PHASE = 15;

function SafeZoneCalculator() {
  const [startingRadiusKm, setStartingRadiusKm] = useState(8);
  const [shrinkPerPhasePercent, setShrinkPerPhasePercent] = useState(30);
  const [currentPhase, setCurrentPhase] = useState(3);

  const metrics = useMemo(() => {
    const shrinkFactor = 1 - shrinkPerPhasePercent / 100;
    const clampedFactor = Math.max(0, shrinkFactor);
    const finalRadius = startingRadiusKm * clampedFactor ** currentPhase;

    const initialArea = Math.PI * startingRadiusKm ** 2;
    const safeArea = Math.PI * finalRadius ** 2;
    const areaLoss = initialArea - safeArea;
    const reductionPercent =
      initialArea > 0 ? (areaLoss / initialArea) * 100 : 0;

    return {
      finalRadius,
      safeArea,
      areaLoss,
      reductionPercent,
    };
  }, [startingRadiusKm, shrinkPerPhasePercent, currentPhase]);

  return (
    <section className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">
      <h1 className="text-2xl font-semibold mb-4">World Safe Zone Calculator</h1>
      <p className="text-sm text-gray-600 mb-6">
        Estimate remaining safe-zone radius and area after each shrink phase.
      </p>

      <form className="grid gap-4" onSubmit={(e) => e.preventDefault()}>
        <label className="grid gap-1">
          <span className="text-sm font-medium">Starting radius (km)</span>
          <input
            type="number"
            min={MIN_RADIUS}
            step="0.1"
            value={startingRadiusKm}
            onChange={(e) => setStartingRadiusKm(Number(e.target.value) || 0)}
            className="border rounded px-3 py-2"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Shrink per phase (%)</span>
          <input
            type="number"
            min={0}
            max={100}
            step="1"
            value={shrinkPerPhasePercent}
            onChange={(e) =>
              setShrinkPerPhasePercent(Number(e.target.value) || 0)
            }
            className="border rounded px-3 py-2"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Current phase</span>
          <input
            type="number"
            min={MIN_PHASE}
            max={MAX_PHASE}
            step="1"
            value={currentPhase}
            onChange={(e) => setCurrentPhase(Number(e.target.value) || 0)}
            className="border rounded px-3 py-2"
          />
        </label>
      </form>

      <div className="mt-6 bg-blue-50 rounded-lg p-4 text-sm leading-7">
        <p>
          <strong>Safe-zone radius:</strong> {metrics.finalRadius.toFixed(2)} km
        </p>
        <p>
          <strong>Safe-zone area:</strong> {metrics.safeArea.toFixed(2)} km²
        </p>
        <p>
          <strong>Area lost:</strong> {metrics.areaLoss.toFixed(2)} km²
        </p>
        <p>
          <strong>Total reduction:</strong> {metrics.reductionPercent.toFixed(1)}
          %
        </p>
      </div>
    </section>
  );
}

export default SafeZoneCalculator;
