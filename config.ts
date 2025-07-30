export const config: {
  bluesky: {
    handle: string;
    password: string;
  };
} = {
  bluesky: {
    handle:
      process.env.BLUESKY_HANDLE ||
      (() => {
        throw new Error("BLUESKY_HANDLE is not set");
      })(),
    password:
      process.env.BLUESKY_PASSWORD ||
      (() => {
        throw new Error("BLUESKY_PASSWORD is not set");
      })(),
  },
};
