import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";

const repo = process.argv[2];
if (!repo || !/^[\w.-]+\/[\w.-]+$/.test(repo))
  throw new Error("Usage: node scripts/publish-issues.mjs OWNER/REPO");
const existing = JSON.parse(
  execFileSync(
    "gh",
    [
      "issue",
      "list",
      "--repo",
      repo,
      "--state",
      "all",
      "--limit",
      "200",
      "--json",
      "title,url",
    ],
    { encoding: "utf8" },
  ),
);
for (const file of readdirSync("docs/issues")
  .filter((file) => file.endsWith(".md"))
  .sort()) {
  const path = `docs/issues/${file}`;
  const title = readFileSync(path, "utf8").split("\n")[0].replace(/^# /, "");
  const found = existing.find((issue) => issue.title === title);
  if (found) {
    console.log(found.url);
    continue;
  }
  console.log(
    execFileSync(
      "gh",
      [
        "issue",
        "create",
        "--repo",
        repo,
        "--title",
        title,
        "--body-file",
        path,
      ],
      { encoding: "utf8" },
    ).trim(),
  );
}
