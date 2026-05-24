declare module "@/components/Ballpit/Ballpit.jsx" {
  import type { ComponentType } from "react";

  type BallpitProps = {
    className?: string;
    count?: number;
    gravity?: number;
    friction?: number;
    wallBounce?: number;
    followCursor?: boolean;
    colors?: string[];
    [key: string]: unknown;
  };

  const Ballpit: ComponentType<BallpitProps>;
  export default Ballpit;
}
