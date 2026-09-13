import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";
import { QueryClient } from "@tanstack/react-query";

const require = createRequire(import.meta.url);
const root = new URL("../../../../", import.meta.url);

test("book and card changes invalidate the personal book views", async () => {
  const client = new QueryClient();
  const load = (file) => {
    const exports = {};
    const { outputText } = ts.transpileModule(readFileSync(file, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    });
    runInNewContext(outputText, {
      exports,
      require: (name) => {
        if (name === "@tanstack/react-query") {
          return { useQueryClient: () => client, useMutation: (options) => options };
        }
        if (name.includes("/api/")) return {};
        if (name.startsWith("@/")) return load(new URL(`${name.slice(2)}.ts`, root));
        if (name.startsWith(".")) return load(new URL(`${name}.ts`, file));
        return require(name);
      },
    });
    return exports;
  };
  const keys = {
    list: ["book", "list", {}],
    detail: ["book", "detail", 1],
    stats: ["me", "libraryStats"],
    summary: ["me", "homeSummary"],
  };
  try {
    for (const [entity, hook, expected] of [
      ["book", "useBookCreateMutation", ["list", "stats", "summary"]],
      ["book", "useBookUpdateMutation", ["list", "detail", "summary"]],
      ["book", "useBookDeleteMutation", ["list", "stats", "summary"]],
      ["book", "useBookCardCreateMutation", ["list", "detail", "stats", "summary"]],
      ["card", "useCardDeleteMutation", ["list", "stats", "summary"]],
      ["card", "useCardUpdateMutation", ["list", "summary"]],
      ["card", "useCardRevisitMutation", ["summary"]],
    ]) {
      client.clear();
      for (const key of Object.values(keys)) client.setQueryData(key, {});
      const options = load(new URL(`entities/${entity}/model/queries/${hook}.ts`, root))[hook]();
      await (options.onSettled ?? options.onSuccess)({}, { path: { bookId: 1 } }, { path: { bookId: 1 } });
      for (const name of expected) {
        assert.equal(client.getQueryState(keys[name])?.isInvalidated, true, `${hook}: ${name}`);
      }
      if (hook === "useBookDeleteMutation") assert.equal(client.getQueryData(keys.detail), undefined);
    }
  } finally {
    client.clear();
  }
});
