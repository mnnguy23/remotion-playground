import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { AnimatedBarChart, AnimatedBarChartProps } from "./AnimatedBarChart";

// Sample data for the bar chart
const sampleChartData: AnimatedBarChartProps = {
  title: "Weekly Downloads",
  subtitle: "Jan 27 - Feb 2, 2026",
  data: [
    { label: "Mon", value: 1240 },
    { label: "Tue", value: 1890 },
    { label: "Wed", value: 2100 },
    { label: "Thu", value: 1650 },
    { label: "Fri", value: 2840 },
    { label: "Sat", value: 980 },
    { label: "Sun", value: 1120 },
  ],
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={60}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="BarChart"
        component={AnimatedBarChart}
        durationInFrames={120}
        fps={30}
        width={1280}
        height={720}
        defaultProps={sampleChartData}
      />
    </>
  );
};
