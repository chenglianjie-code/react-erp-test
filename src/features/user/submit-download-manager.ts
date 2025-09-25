import { DownloadManager, type BatchTaskResult } from "@/features/shared";
import { xlsxService } from "@/features/axios";
import { format } from "date-fns";

export class SubmitDownloadManager extends DownloadManager {
  Headers: string[];

  constructor(filename: string, headers?: string[]) {
    super(filename);
    this.Headers = headers ?? ["流程编号", "失败原因"];
  }

  async onDownload(data: BatchTaskResult[]): Promise<void> {
    await xlsxService.toXlsx(
      data.map((item) => [item.key, item.message]),
      {
        filename: `${this._filename ?? ""}${format(Date.now(), "yyyyMMddHHmmss")}.xlsx`,
        headers: this.Headers,
        columns: [{ width: 32 }, { width: 48 }],
      }
    );
  }
}
