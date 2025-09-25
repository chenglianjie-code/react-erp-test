import {
  BatchTaskResult,
  ImportTaskDto,
  BatchTaskType,
  BatchTaskStatus,
  BatchTaskResultStatus,
} from "./batch-task.dto";
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
      list: [
        { key: "用户1", message: "电话号码不符合规范", result: BatchTaskResultStatus.失败 } as T,
        { key: "用户2", message: "地址不正确", result: BatchTaskResultStatus.失败 } as T,
        { key: "用户3", message: "导入成功", result: BatchTaskResultStatus.成功 } as T,
        { key: "用户4", message: "导入成功", result: BatchTaskResultStatus.成功 } as T,
      ] as T[],
      file_path: "",
      fail_num: 2,
      success_num: 2,
      total_num: 4,
      status: Math.random() < 0.5 ? BatchTaskStatus.已完成 : BatchTaskStatus.处理中,
    });
    console.log("轮询返回的结果", data);
    return data;
  }
}

export const batchTaskService = new BatchTaskService();
