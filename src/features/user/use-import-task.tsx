import type { ReactNode } from "react";
import { BatchImportTask } from "@/features/shared";

export class UserImportTask extends BatchImportTask {
  getTaskResultModal(): ReactNode {
    return <div>我是批量任务modal</div>;
  }
}
