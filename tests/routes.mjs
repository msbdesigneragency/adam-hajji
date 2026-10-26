const paths = ["/fr", "/en", "/ar", "/admin"];
const services = [
  "consultation",
  "cleaning",
  "whitening",
  "orthodontics",
  "veneers",
  "implants",
  "cavities",
  "endodontics",
  "surgery",
  "prosthetics",
  "aesthetics",
  "emergency",
];
for (const locale of ["fr", "en", "ar"]) {
  paths.push("/" + locale + "/services");
  for (const slug of services) paths.push("/" + locale + "/services/" + slug);
}
for (let i = 0; i < paths.length; i += 4) {
  const results = await Promise.all(
    paths.slice(i, i + 4).map(async (path) => {
      const res = await fetch(
        (process.env.TEST_BASE_URL || "http://127.0.0.1:3000") + path,
      );
      const html = await res.text();
      if (res.status !== 200) throw new Error(path + " returned " + res.status);
      if (path.startsWith("/ar") && !html.includes('lang="ar"'))
        throw new Error("Missing server Arabic lang");
      return path + " " + res.status;
    }),
  );
  console.log(results.join("\n"));
}
for (const path of ["/fr/services/unknown", "/zz"]) {
  const res = await fetch(
    (process.env.TEST_BASE_URL || "http://127.0.0.1:3000") + path,
  );
  if (res.status !== 404) throw new Error("Expected 404 for " + path);
  console.log(path + " 404");
}
console.log("All 43 valid routes and 2 invalid routes verified.");
