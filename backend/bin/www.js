const config = require('../config'); // load dotenv + config early
const { validateEnv } = require('../common/validateEnv');

validateEnv(config);

const app = require('../app');

const port = config.server.port;
const host = config.server.host;

app.listen(port, host, () => {
  console.log(`${config.app.name} listening on http://localhost:${port}`);
});
