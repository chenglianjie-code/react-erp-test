import { BatchTaskResult, ImportTaskDto, BatchTaskType, BatchTaskStatus } from "./batch-task.dto";
import { axios } from "@/features/axios";

export class BatchTaskService {
  /**
   * 获取当前导入任务进度的接口
   * @param taskId 批量处理任务 ID
   * @param label 任务所属功能模块
   * @returns
   */
  async getImportTaskProgress<T extends BatchTaskResult = BatchTaskResult>(label: string, taskId: string) {
    console.log("参数label和taskId", label, taskId);
    const { data } = await axios<ImportTaskDto<T>>({
      batch_id: taskId,
      label: label,
      type: BatchTaskType.异步,
      list: [],
      file_path: "",
      fail_num: 0,
      success_num: 1,
      total_num: 1,
      status: Math.random() < 0.5 ? BatchTaskStatus.已完成 : BatchTaskStatus.处理中,
    });
    return data;
  }
}

export const batchTaskService = new BatchTaskService();
