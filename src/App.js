import * as React from "react";
import RadarChart from "react-svg-radar-chart";
import "react-svg-radar-chart/build/css/index.css";

const MIN_RANK = 0;
const MAX_RANK = 5;
const MAX_MATRICES = 5;

const GRAPH_OPTIONS = {
  dots: true,
  zoomDistance: 1,
  scales: MAX_RANK
};

const toDecimal = (value) => (value * (10 / MAX_RANK)) / 10;
const fromDecimal = (value) => (value / (10 / MAX_RANK)) * 10;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const clampRank = (value) => clamp(value, MIN_RANK, MAX_RANK);

function App() {
  const [colors, setColors] = React.useState([
    "#bada55",
    "#c0ffee",
    "#5ada55",
    "#fa7a55",
    "#b00b1e"
  ]);
  const [tools, setTools] = React.useState(["Mastering typescript"]);
  const [skillsMatrix, setSkillsMatrix] = React.useState({});

  const skillsSegments = {
    tools,
    engineering: [
      "Writing testable maintainable code",
      "Understanding systems and code",
      "Software architecture",
      "Security",
      "Dev ops infra platforms"
    ],
    delivery: [
      "Estimating slicing",
      "Prioritisation dependencies",
      "Ambiguity risk uncertainty",
      "Reliability delivery accountability",
      "Economic thinking",
      "Continuous improvement"
    ],
    quality: ["Writing code", "Testing", "Debugging", "Observability"]
  };

  const captions = Object.values(skillsSegments)
    .reduce((acc, curr) => [...acc, ...curr], []) // flatten
    .reduce(
      (acc, curr) => ({ [btoa(curr)]: curr, ...acc }), // give keys
      {}
    );

  const skillData = Object.keys(captions).reduce(
    (acc, curr) => ({ ...acc, [curr]: skillsMatrix[curr] || 0 }),
    {}
  );

  const currentState = {
    data: skillData,
    meta: { color: "blue" }
  };

  const data = [currentState];

  const options = GRAPH_OPTIONS;

  const handleValueChange = (index) => (event) =>
    setSkillsMatrix((prev) => ({
      ...prev,
      [index]: toDecimal(clampRank(event.target.value))
    }));

  return (
    <div className="App">
      <h1>Skills Matrix</h1>
      <div>
        {Object.entries(captions).map(([index, label]) => (
          <div key={index}>
            <label>
              <span>{label}</span>
              <br />
              <input
                type="number"
                min={MIN_RANK}
                max={MAX_RANK}
                step={1}
                value={fromDecimal(skillData[index])}
                onChange={handleValueChange(index)}
              />
            </label>
          </div>
        ))}
      </div>
      <div>
        <RadarChart
          captions={captions}
          data={data}
          size={800}
          options={options}
        />
      </div>
    </div>
  );
}

export default App;
