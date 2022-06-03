export const cockpitHttp = cockpit.http(2224, {
  address: "localhost",
  tls: {
    validate: false,
  },
});
