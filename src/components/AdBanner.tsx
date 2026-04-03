import { useEffect, useRef } from "react";

interface AdBannerProps {
  size?: "small" | "medium" | "large";
  slot?: string;
}

const AdBanner = ({ size = "medium", slot = "auto" }: AdBannerProps) => {
  const adRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      const adsbygoogle = (window as any).adsbygoogle || [];
      adsbygoogle.push({});
      pushed.current = true;
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  const heightMap = {
    small: "min-h-[100px]",
    medium: "min-h-[250px]",
    large: "min-h-[280px]",
  };

  return (
    <div className={`${heightMap[size]} w-full overflow-hidden`} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-8908365852983702"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdBanner;
