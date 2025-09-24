import { format } from "date-fns";
import type { ColInfo } from "xlsx";
import type { BatchTaskResult } from "./batch-task.dto";

export abstract class DownloadManager<T = BatchTaskResult> {
  static formatFileName(rawName: string) {
    return `${rawName}${format(Date.now(), "yyyyMMddHHmmss")}.xlsx`;
  }

  protected _filename: string;

  abstract Headers: string[];

  Columns: ColInfo[] | undefined;

  constructor(filename: string) {
    this._filename = filename;
  }

  abstract onDownload(data: T[]): Promise<void>;
}
