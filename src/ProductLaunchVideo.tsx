import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Audio,
  Img,
  staticFile,
  Easing,
} from "remotion";

// =============================================================================
// SCENE 1: Intro Title
// =============================================================================
const IntroScene: React.FC<{ title: string; tagline: string }> = ({
  title,
  tagline,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title animation
  const titleScale = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  // Tagline slides up after title
  const taglineY = interpolate(frame, [20, 40], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const taglineOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Background gradient shift
  const gradientPosition = interpolate(frame, [0, 90], [0, 100]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${135 + gradientPosition * 0.5}deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)`,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Decorative circles */}
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)",
          transform: `scale(${titleScale * 1.5})`,
        }}
      />

      <div style={{ textAlign: "center", zIndex: 1 }}>
        <h1
          style={{
            fontSize: 80,
            fontWeight: 800,
            color: "#fff",
            margin: 0,
            transform: `scale(${titleScale})`,
            opacity: titleOpacity,
            letterSpacing: "-0.03em",
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: 32,
            color: "#a5b4fc",
            margin: 0,
            marginTop: 20,
            transform: `translateY(${taglineY}px)`,
            opacity: taglineOpacity,
            fontWeight: 500,
          }}
        >
          {tagline}
        </p>
      </div>
    </AbsoluteFill>
  );
};

// =============================================================================
// SCENE 2: Feature Card
// =============================================================================
const FeatureScene: React.FC<{
  icon: string;
  title: string;
  description: string;
  color: string;
}> = ({ icon, title, description, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card slides in from right
  const slideX = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });
  const cardX = interpolate(slideX, [0, 1], [200, 0]);

  // Icon bounces
  const iconScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 8, stiffness: 150 },
  });

  // Text fades in
  const textOpacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#0f0f0f",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          transform: `translateX(${cardX}px)`,
          background: "#1a1a1a",
          borderRadius: 24,
          padding: 60,
          width: 700,
          boxShadow: `0 0 60px ${color}30`,
          border: `1px solid ${color}40`,
        }}
      >
        {/* Icon */}
        <div
          style={{
            fontSize: 72,
            transform: `scale(${Math.max(0, iconScale)})`,
            marginBottom: 24,
          }}
        >
          {icon}
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#fff",
            margin: 0,
            opacity: textOpacity,
          }}
        >
          {title}
        </h2>

        {/* Description */}
        <p
          style={{
            fontSize: 24,
            color: "#888",
            margin: 0,
            marginTop: 16,
            opacity: textOpacity,
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>

        {/* Accent bar */}
        <div
          style={{
            width: interpolate(frame, [20, 50], [0, 100], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            height: 4,
            background: color,
            borderRadius: 2,
            marginTop: 32,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// =============================================================================
// SCENE 3: Call to Action
// =============================================================================
const CTAScene: React.FC<{ text: string; buttonText: string }> = ({
  text,
  buttonText,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const buttonScale = spring({
    frame: frame - 25,
    fps,
    config: { damping: 10, stiffness: 200 },
  });

  // Pulsing glow on button
  const glowIntensity = interpolate(
    Math.sin(frame * 0.15),
    [-1, 1],
    [20, 40]
  );

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h2
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#fff",
            margin: 0,
            opacity: textOpacity,
            maxWidth: 800,
            lineHeight: 1.3,
          }}
        >
          {text}
        </h2>

        <div
          style={{
            marginTop: 50,
            transform: `scale(${Math.max(0, buttonScale)})`,
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "#fff",
              color: "#764ba2",
              fontSize: 28,
              fontWeight: 700,
              padding: "20px 50px",
              borderRadius: 50,
              boxShadow: `0 0 ${glowIntensity}px rgba(255,255,255,0.5)`,
            }}
          >
            {buttonText}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// =============================================================================
// TRANSITION: Fade
// =============================================================================
const FadeTransition: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#000",
        opacity,
      }}
    />
  );
};

// =============================================================================
// MAIN COMPOSITION: Product Launch Video
// =============================================================================
export type ProductLaunchProps = {
  productName: string;
  tagline: string;
  features: Array<{
    icon: string;
    title: string;
    description: string;
    color: string;
  }>;
  ctaText: string;
  ctaButton: string;
  // audioSrc?: string; // Optional background music
};

export const ProductLaunchVideo: React.FC<ProductLaunchProps> = ({
  productName,
  tagline,
  features,
  ctaText,
  ctaButton,
  // audioSrc,
}) => {
  const { fps } = useVideoConfig();

  // Timeline (in frames at 30fps):
  // 0-90: Intro (3 seconds)
  // 90-95: Fade transition
  // 95-185: Feature 1 (3 seconds)
  // 185-190: Fade
  // 190-280: Feature 2 (3 seconds)
  // 280-285: Fade
  // 285-375: Feature 3 (3 seconds)
  // 375-380: Fade
  // 380-470: CTA (3 seconds)

  const sceneDuration = 90; // 3 seconds
  const transitionDuration = 5;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* Background music (uncomment if you have audio)
      {audioSrc && (
        <Audio src={audioSrc} volume={0.3} />
      )}
      */}

      {/* Scene 1: Intro */}
      <Sequence from={0} durationInFrames={sceneDuration + transitionDuration}>
        <IntroScene title={productName} tagline={tagline} />
      </Sequence>

      {/* Transition 1 */}
      <Sequence from={sceneDuration - transitionDuration} durationInFrames={transitionDuration * 2}>
        <FadeTransition durationInFrames={transitionDuration} />
      </Sequence>

      {/* Feature Scenes */}
      {features.map((feature, index) => {
        const startFrame = sceneDuration + index * (sceneDuration + transitionDuration);
        return (
          <React.Fragment key={index}>
            <Sequence
              from={startFrame}
              durationInFrames={sceneDuration + transitionDuration}
            >
              <FeatureScene {...feature} />
            </Sequence>

            {/* Transition after each feature */}
            <Sequence
              from={startFrame + sceneDuration - transitionDuration}
              durationInFrames={transitionDuration * 2}
            >
              <FadeTransition durationInFrames={transitionDuration} />
            </Sequence>
          </React.Fragment>
        );
      })}

      {/* Scene: CTA */}
      <Sequence
        from={sceneDuration + features.length * (sceneDuration + transitionDuration)}
        durationInFrames={sceneDuration}
      >
        <CTAScene text={ctaText} buttonText={ctaButton} />
      </Sequence>
    </AbsoluteFill>
  );
};

// Default props for preview
export const defaultProductLaunchProps: ProductLaunchProps = {
  productName: "Acme Pro",
  tagline: "The future of productivity",
  features: [
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Built for speed. Every interaction feels instant.",
      color: "#fbbf24",
    },
    {
      icon: "🔒",
      title: "Secure by Default",
      description: "Enterprise-grade security without the complexity.",
      color: "#22c55e",
    },
    {
      icon: "🎨",
      title: "Beautiful Design",
      description: "Crafted with attention to every pixel.",
      color: "#a855f7",
    },
  ],
  ctaText: "Ready to transform your workflow?",
  ctaButton: "Start Free Trial →",
};
