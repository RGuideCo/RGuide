declare module "capitals-coordinates" {
  const capitals: {
    rawData: Array<{
      type: "Feature";
      geometry?: {
        type: "Point";
        coordinates?: [number, number];
      };
      properties?: {
        capital?: string;
        country?: string;
        continent?: string;
      };
    }>;
  };

  export default capitals;
}
