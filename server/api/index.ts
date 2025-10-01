// Use compiled output when deployed (dist), fallback to TS in dev
let app;
try {
  // @ts-ignore
  app = (await import("../dist/app.js")).default;
} catch {
  // @ts-ignore
  app = (await import("../src/app.js")).default;
}

export default app;


