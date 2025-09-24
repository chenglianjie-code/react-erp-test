/**
 * 批量任务状态，处理中还是已完成
 */
export const enum BatchTaskStatus {
  处理中 = "processing",
  已完成 = "completed",
}

/**
 * 批量任务结果状态，成功还是失败
 */
export const enum BatchTaskResultStatus {
  成功 = "success",
  失败 = "fail",
}

/**
 * 批量任务类型
 */
export const enum BatchTaskType {
  同步 = "sync",
  异步 = "async",
}

/**
 * 批量处理结果
 */
export interface BatchTaskResult {
  key: string;
  result: BatchTaskResultStatus;
  message: string;
}

/**
 * 异步方式返回的批量任务结果
 * 该方式的结果需要使用任务码去轮询任务处理结果
 */
export interface AsyncBatchTaskDto<T extends BatchTaskResult = BatchTaskResult> {
  /**
   * 批量处理任务码
   * 需要使用这个任务码来获取任务进度
   */
  batch_id: string;
  type: BatchTaskType;
  list: T[];
  file_path?: string;
  fail_num: number;
  success_num: number;
  total_num: number;
  status: BatchTaskStatus;
}

/**
 * 导入返回的结果，比异步方式多一个label，表示具体的模块
 */
export interface ImportTaskDto<T extends BatchTaskResult = BatchTaskResult> extends AsyncBatchTaskDto<T> {
  /**
   * 模块类型
   */
  label: string;
}

/**
 * 同步方式返回的批量任务结果
 * 该方式可以直接获取到任务处理结果
 */
export interface SyncBatchTaskDto<T extends BatchTaskResult = BatchTaskResult> {
  /**
   * 批量处理任务码id
   */
  batch_id: string;
  type: BatchTaskType;
  list: T[];
  file_path?: string;
  fail_num: number;
  success_num: number;
  total_num: number;
  status: BatchTaskStatus;
}

/**
 * 批量任务操作结果
 * 可能是异步的，也有可能是同步的
 */

export type BatchTaskDto<T extends BatchTaskResult = BatchTaskResult> = AsyncBatchTaskDto<T> | SyncBatchTaskDto<T>;
