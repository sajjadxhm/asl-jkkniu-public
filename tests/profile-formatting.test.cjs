const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const moduleCopy = { exports: {} };
const source = fs.readFileSync(path.join(__dirname, "../src/components/profile/formatted-profile-text.tsx"), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: {
  module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020,
} });
vm.runInNewContext(outputText, { module: moduleCopy, exports: moduleCopy.exports, require, URL });
const render = text => renderToStaticMarkup(React.createElement(moduleCopy.exports.FormattedProfileText, { text }));

test("renders supported formatting and preserves list order", () => {
  const html = render("### Education\n**Degree** and *distinction*\n\n- First institution\n- Second institution\n\n1. Project one\n2. Project two\n\n[Publication](https://example.org/paper)");
  for (const tag of ["h3", "strong", "em", "ul", "ol", "li", "a"]) assert.match(html, new RegExp("<" + tag + "[ >]"));
  assert.ok(html.indexOf("First institution") < html.indexOf("Second institution"));
  assert.match(html, /href="https:\/\/example.org\/paper"/);
  assert.match(html, /target="_blank" rel="noopener noreferrer"/);
});
test("plain text and line breaks remain readable, including old profiles", () => {
  const html = render("BSc, University\r\n2019-2023\r\n\r\nResearch award & recognition");
  assert.match(html, /BSc, University\n2019-2023/);
  assert.match(html, /Research award &amp; recognition/);
  assert.equal((html.match(/<p /g) || []).length, 2);
});
test("raw HTML is escaped and unsafe or malformed links are not clickable", () => {
  const html = render('<script>alert(1)</script>\n<img src=x onerror=alert(1)>\n\n[Unsafe](javascript:alert) [Data](data:text/html,test) [Broken](not-a-url)');
  assert.doesNotMatch(html, /<script|<img|href=|onerror="/);
  assert.match(html, /&lt;script&gt;/);
  for (const label of ["Unsafe", "Data", "Broken"]) assert.ok(html.includes(label));
});
test("unclosed formatting stays text and empty values render safely", () => {
  assert.match(render("**unfinished"), /\*\*unfinished/);
  assert.doesNotMatch(render(""), /<p|<a /);
});
