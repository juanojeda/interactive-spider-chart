import * as React from "react";
import RadarChart from "react-svg-radar-chart";
import "react-svg-radar-chart/build/css/index.css";
import { fromDecimal, toDecimal, clamp, keyify } from "./utils";
import { styled } from "@linaria/react";
import { transparentize } from "polished";

const MIN_RANK = 0;
const MAX_RANK = 5;
const _MAX_SERIES = 5;
const THEME = [
  "#540054",
  "#005400",
  "#000054",
  "#540000",
  "#005454",
  "#545400"
];

const GRAPH_OPTIONS = {
  dots: true,
  zoomDistance: 1,
  scales: MAX_RANK
};

const clampRank = (value) => clamp(value, MIN_RANK, MAX_RANK);

const getDefaultValues = (captions) =>
  Object.keys(captions).reduce((acc, curr) => {
    return { ...acc, [curr]: 0 };
  }, {});

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 300px 300px auto;
`;

const FormContainer = styled.div`
  padding-left: 15px;
  padding-right: 15px;
  /* border: 2px solid ${(props) => transparentize(0.5, props.matrixColor)}; */
  background: ${(props) => transparentize(0.65, props.matrixColor)};
`;

const SkillInput = styled.label`
  display: block;
  padding-bottom: 5px;
`;

const SeriesLabel = styled.button`
  appearance: none;
  background: ${(props) => transparentize(0.65, props.seriesColor)};
  border: none;
  cursor: pointer;
  display: block;
  margin-bottom: 5px;
  padding: 5px;
  width: auto;
`;

function EditSkillSummary({
  matrixTitle,
  skillData,
  onValueChange,
  captions,
  matrixColor
}) {
  return (
    <FormContainer matrixColor={matrixColor}>
      <h2>{matrixTitle}</h2>
      {Object.entries(captions).map(([index, label]) => (
        <SkillInput key={index}>
          <span>{label}</span>
          <br />
          <input
            type="number"
            min={MIN_RANK}
            max={MAX_RANK}
            step={1}
            value={fromDecimal(skillData[index], MAX_RANK)}
            onChange={onValueChange(index)}
          />
        </SkillInput>
      ))}
    </FormContainer>
  );
}

function App() {
  const [colors, _setColors] = React.useState(THEME);
  const [tools, _setTools] = React.useState(["Mastering typescript"]);
  const [skillsData, setSkillsData] = React.useState({});
  const [allMatrices, setAllMatrices] = React.useState(["Current skills"]);
  const [currentMatrix, setCurrentMatrix] = React.useState(allMatrices[0]);
  const [newMatrixLabel, setNewMatrixLabel] = React.useState("");
  const [showGraph, setShowGraph] = React.useState(false);

  const currentMatrixKey = keyify(currentMatrix);
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
      (acc, curr) => ({ [keyify(curr)]: curr, ...acc }), // give keys
      {}
    );

  React.useEffect(() => {
    let shouldUpdate = false;
    const defaults = getDefaultValues(captions);

    const newMatrixData = allMatrices.reduce((acc, matrixLabel) => {
      const labelKey = keyify(matrixLabel);
      const existingData = skillsData[labelKey];

      if (!existingData) {
        shouldUpdate = true;
      }

      return {
        ...acc,
        [labelKey]: existingData ? skillsData[labelKey] : { ...defaults }
      };
    }, {});

    if (shouldUpdate) {
      console.log("a thing is happening");
      setSkillsData(newMatrixData);
    }
  }, [allMatrices, captions, skillsData]);

  React.useEffect(() => {
    let canShowGraph = allMatrices.every(
      (matrixLabel) => !!skillsData[keyify(matrixLabel)]
    );

    if (canShowGraph) {
      setShowGraph(true);
    }
  }, [allMatrices, skillsData]);

  React.useEffect(() => {
    setCurrentMatrix(allMatrices[allMatrices.length - 1]);
    setNewMatrixLabel("");
  }, [allMatrices]);

  const options = GRAPH_OPTIONS;

  const data = allMatrices.map((matrixLabel, i) => {
    return {
      data: skillsData[keyify(matrixLabel)],
      meta: { color: colors[i] }
    };
  });

  const handleValueChange = (index) => (event) =>
    setSkillsData((prev) => {
      const currentMatrixValues = prev[currentMatrixKey];

      return {
        ...prev,
        [currentMatrixKey]: {
          ...currentMatrixValues,
          [index]: toDecimal(clampRank(event.target.value), MAX_RANK)
        }
      };
    });

  const handleAddNewSeries = () => {
    if (allMatrices.includes(newMatrixLabel)) {
      setNewMatrixLabel("");
      return;
    }
    setShowGraph(false);
    setAllMatrices((prev) => [...prev, newMatrixLabel]);
  };

  return (
    <>
      <h1 className="">Skills Matrix</h1>
      <GridContainer>
        <div>
          <h2>All matrices</h2>
          {allMatrices.map((matrixLabel, i) => (
            <SeriesLabel
              key={matrixLabel}
              seriesColor={colors[i]}
              onClick={() => setCurrentMatrix(matrixLabel)}
            >
              {matrixLabel} (edit)
            </SeriesLabel>
          ))}
          <div>
            <input
              type="text"
              onChange={(e) => setNewMatrixLabel(e.target.value)}
              value={newMatrixLabel}
            />
            <button onClick={handleAddNewSeries}>Add matrix</button>
          </div>
        </div>
        {skillsData[currentMatrixKey] && (
          <EditSkillSummary
            matrixTitle={currentMatrix}
            skillData={skillsData[currentMatrixKey]}
            captions={captions}
            onValueChange={handleValueChange}
            matrixColor={colors[allMatrices.indexOf(currentMatrix)]}
          />
        )}
        <div>
          {showGraph && <RadarChart {...{ options, data, captions }} />}
        </div>
      </GridContainer>
    </>
  );
}

export default App;
