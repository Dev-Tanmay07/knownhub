import { Megaphone } from "lucide-react";

interface AdBannerProps {
  size?: "small" | "medium" | "large";
}

const AdBanner = ({ size = "medium" }: AdBannerProps) => {
  const heightMap = {
    small: "h-20",
    medium: "h-32 md:h-40",
    large: "h-48 md:h-64",
  };

  return (
    <div className={`ad-banner flex flex-col items-center justify-center gap-2 ${heightMap[size]}`}>
      <Megaphone className="h-6 w-6 text-muted-foreground" />
      <p className="text-sm font-body text-muted-foreground font-medium">
        Advertisement
      </p>
      <p className="text-xs text-muted-foreground/60">
        Your ad could be here — <span className="wiki-link">Contact us</span>
      </p>
    </div>
  );
};

export default AdBanner;
