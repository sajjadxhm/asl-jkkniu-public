// Heuristic audit of tracked files and all locally reachable historical blobs.
// Output only object/path/type metadata, never matched credential values.
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const git = (...args) => execFileSync("git", args, { maxBuffer: 64 * 1024 * 1024 });
const patterns = [
  ["database URL with password", /postgres(?:ql)?:\/\/[^\s:/]+:([^\s@]+)@/gi],
  ["Supabase secret", /\bsb_secret_[A-Za-z0-9_-]{15,}/g],
  ["GitHub token", /\b(?:gh[pousr]_[A-Za-z0-9]{25,}|github_pat_[A-Za-z0-9_]{30,})/g],
  ["AWS access key", /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g],
  ["private key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g],
  ["credential assignment", /(?:AUTH_SECRET|SUPABASE_(?:SECRET|SERVICE_ROLE)_KEY|ADMIN_PASSWORD|password|api[_-]?key|access[_-]?token)\s*[:=]\s*["']([^"'\r\n]{12,})["']/gi],
];
const findings = [];
function scan(buffer, location) {
  const content = buffer.toString("utf8");
  for (const [type, regex] of patterns) {
    regex.lastIndex = 0;
    for (const match of content.matchAll(regex)) {
      const value = match[1] || match[0];
      if (/placeholder|example|process\.env|your[_-]|<|\$\{|not-a-real|test-password|replace-with/i.test(value) || /^\[?(?:DB_)?PASSWORD\]?$/i.test(value)) continue;
      findings.push({ location, type, line: content.slice(0, match.index).split("\n").length });
    }
  }
  for (const match of content.matchAll(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g)) {
    try {
      const claims = JSON.parse(Buffer.from(match[0].split(".")[1], "base64url"));
      if (claims.role === "service_role") findings.push({ location, type: "Supabase service-role JWT" });
    } catch {}
  }
}
const files = git("ls-files", "-z").toString().split("\0").filter(Boolean);
for (const file of files) scan(fs.readFileSync(file), "working tree: " + file);
const objects = process.argv.includes("--current-only") ? [] : git("rev-list", "--objects", "--all").toString().trim().split("\n");
let blobs = 0;
for (const entry of objects) {
  const oid = entry.split(" ")[0];
  if (git("cat-file", "-t", oid).toString().trim() !== "blob") continue;
  blobs++;
  scan(git("cat-file", "blob", oid), "history: " + entry);
}
console.log(JSON.stringify({ trackedFiles: files.length, historicalBlobs: blobs, findings }, null, 2));
process.exitCode = findings.length ? 1 : 0;
