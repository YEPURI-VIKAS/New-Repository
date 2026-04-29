"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
const app = (0, app_1.createApp)();
app.listen(env_1.env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[backend] listening on :${env_1.env.PORT}`);
});
//# sourceMappingURL=server.js.map