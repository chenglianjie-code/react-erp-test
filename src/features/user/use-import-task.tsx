import type { ReactNode } from "react";
import {
  BatchImportTask,
  BatchImportTaskResultModal,
  BatchTaskResult,
  BatchTask,
  BatchTaskResultModal,
} from "@/features/shared";
import { batchTaskService } from "@/features/shared/batch-task";
import { TaskResultModalOptions } from "@/features/shared/batch-task/batch-task";

export class UserImportTask extends BatchImportTask {
  getTaskResultModal(): ReactNode {
    return (
      <BatchImportTaskResultModal
        successNumber={this._successNumber}
        downloadable
        failedNumber={this._failedNumber}
        data={this.ResultList}
        failPath={this.FilePath}
        rowKey={(row) => row.key}
        columns={[
          {
            title: "用户名称",
            width: 120,
            render: (_: any, item: any) => item.key,
          },
          {
            title: "失败原因",
            width: 276,
            render: (_: any, item: any) => item.message,
          },
        ]}
      />
    );
  }
}

/**
 * 继承TaskResultModalOptions，总是报错，这里先不继承
 */
interface SupplyTaskResultModalOptions extends TaskResultModalOptions {
  /**
   * 错误弹窗，表格标题
   */
  title?: string;
}
export class PurchaseOrderBatchTask extends BatchTask {
  protected getTaskProgress(taskId: string) {
    return batchTaskService.getSupplyBatchTaskProgress(taskId);
  }
  getTaskResultModal(options?: SupplyTaskResultModalOptions): ReactNode {
    const downloadManager = options?.downloadManager;

    return (
      <BatchTaskResultModal
        rowKey={(row) => row.key}
        successNumber={this._successNumber}
        failedNumber={this._failedNumber}
        data={this.ResultList}
        columns={[
          {
            title: options?.title ? options.title : "采购单号",
            render: (_: any, item: any) => item.key,
          },
          {
            title: "失败原因",
            render: (_: any, item: any) => item.message,
          },
        ]}
        onDownload={downloadManager ? () => downloadManager.onDownload(this.ResultList) : void 0}
      ></BatchTaskResultModal>
    );
  }
}
