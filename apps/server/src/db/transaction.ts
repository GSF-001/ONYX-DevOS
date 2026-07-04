import { db } from "./client.js";

type TxCallback<T> = (tx: Parameters<Parameters<typeof db.transaction>[0]>[0]) => Promise<T>;

export async function withTransaction<T>(callback: TxCallback<T>): Promise<T> {
  return db.transaction(async (tx) => callback(tx));
}
