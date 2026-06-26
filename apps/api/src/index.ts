import "./load-env.js";
import { createApp } from "./app.js";
import { checkoutMode, env } from "./config.js";

const app = createApp();

app.listen(env.API_PORT, "0.0.0.0", () => {
  console.log(`Nordstrand API listening on http://localhost:${env.API_PORT}`);
  console.log(`Checkout mode: ${checkoutMode}`);
});
