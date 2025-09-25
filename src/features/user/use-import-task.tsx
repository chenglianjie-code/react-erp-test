import type { ReactNode } from "react";
import { BatchImportTask, BatchImportTaskResultModal, BatchTaskResult } from "@/features/shared";

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
            render: (_, item) => item.key,
          },
          {
            title: "失败原因",
            width: 276,
            render: (_, item) => item.message,
          },
        ]}
      />
    );
  }
}
