import { resolve } from "std/path/mod.ts";
import { readFile, writeFile } from "@/util/fileOperations.ts";
import { validateSchema } from "@/util/validateSchema.ts";

export function update(
  directory: string,
  tenant: string,
  table: string,
  key: string,
  document: Record<string, any>,
) {
  const tablePath = resolve(directory, tenant, `${table}.ck`);

  let curTable;
  try {
    curTable = readFile(tablePath);
  } catch (_err) {
    throw "Table does not exist";
  }
  if (!Object.hasOwn(curTable.documents, key)) {
    throw "Can't update document if document does not exist";
  }
  if (curTable.schema !== null) {
    validateSchema(directory, tenant, document, curTable.schema);
  }
  curTable.documents[key] = document;
  writeFile(tablePath, curTable);
  return key;
}
