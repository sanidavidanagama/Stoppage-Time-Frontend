// Runtime config, loaded before the app bundle.
// Override API_URL here at deploy time (e.g. templated by the container
// entrypoint) to point a static build at a different backend without a
// rebuild. Leave empty to fall back to VITE_API_URL / localhost.
window.__APP_CONFIG__ = {
  API_URL: "",
};
