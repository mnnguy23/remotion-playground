import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { AnimatedBarChart, AnimatedBarChartProps } from "./AnimatedBarChart";
import {
  ProductLaunchVideo,
  defaultProductLaunchProps,
} from "./ProductLaunchVideo";
import { ThreeScene } from "./ThreeScene";

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
  // Calculate duration for product launch video
  // Intro (90) + 3 features × (90 + 5 transition) + CTA (90) = 555 frames
  const productLaunchDuration =
    90 + defaultProductLaunchProps.features.length * 95 + 90;

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
      <Composition
        id="ProductLaunch"
        component={ProductLaunchVideo}
        durationInFrames={productLaunchDuration}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={defaultProductLaunchProps}
      />
      <Composition
        id="ThreeScene"
        component={ThreeScene}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ title: "Three.js + Remotion" }}
      />
    </>
  );
};
