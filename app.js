require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const routes = require("./routes");
const Sentry = require("@sentry/node");
const { SENTRY_DSN } = process.env;

const app = express();
const PORT = process.env.PORT || 3000;

Sentry.init({
  dsn: SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(routes);

app.get("/", (req, res) =>
  res.json({ status: true, message: "Hello World!", data: null })
);

app.use(Sentry.Handlers.errorHandler());
// 404 error handler
app.use((req, res, next) => {
  res.status(404).json({
    status: false,
    message: `are you lost? ${req.method} ${req.url} is not registered!`,
    data: null,
  });
});

// 500 error handler
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    status: false,
    message: err.message,
    data: null,
  });
});

app.listen(PORT, () => console.log("Listening on port", PORT));

module.exports = app;