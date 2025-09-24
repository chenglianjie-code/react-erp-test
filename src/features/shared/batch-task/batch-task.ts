import { BatchTaskResult, BatchTaskType, BatchTaskStatus, BatchTaskDto, ImportTaskDto } from "./batch-task.dto";
import type { ReactNode } from "react";
import type { TableProps } from "antd";
import { DownloadManager } from "./download-manager";
import { batchTaskService } from "./batch-task.service";

/**
 * 批量任务的抽象类，实现了公共批量任务的逻辑，各模块需要基于该抽象类进行扩展
 * note：抽象类，不能直接实例化，抽象方法，必须在子类中被实现
 * T extends BatchTaskResult = BatchTaskResult,当T没有显式提供时，T就是BatchTaskResult
 */
export abstract class BatchTask<T extends BatchTaskResult = BatchTaskResult> {
  /**
   * 任务 id，用来获取任务进度
   */
  protected _taskId: string;
  /**
   * 任务类型
   * 同步(sync)或异步(async)的任务，同步的任务可以立即拿到结果，而异步的任务需要不断的去轮询，只到任务状态为已完成
   */
  protected _type: BatchTaskType;
  /**
   * 当前任务状态，处理中 = "processing", 已完成 = "completed"
   */
  protected _status: BatchTaskStatus;
  /**
   * 获取当前任务状态
   */
  get Status(): BatchTaskStatus {
    return this._status;
  }
  /**
   * 获取是否已完成
   */
  get IsCompleted(): boolean {
    return this._status === BatchTaskStatus.已完成;
  }
  /**
   * 成功的数量
   */
  protected _successNumber: number;
  /**
   * 失败的数量
   */
  protected _failedNumber: number;
  /**
   * 获取成功的数量
   */
  get SuccessNumber(): number {
    return this._successNumber;
  }
  /**
   * 获取失败的数量
   */
  get FailedNumber(): number {
    return this._failedNumber;
  }
  /**
   * 文件路径，(下载失败订单使用)
   */
  protected _filePath?: string;
  /**
   * 获取文件路径
   */
  get FilePath() {
    return this._filePath;
  }
  /**
   * 是否成功
   *
   * 任务执行完且无失败项视为成功
   */
  get IsSuccess() {
    return this.IsCompleted && !this.FailedNumber;
  }
  /**
   * 总数
   */
  protected _total: number;
  /**
   * 获取总数
   */
  get Total(): number {
    return this._total;
  }
  /**
   * 操作结果列表
   * 这里会包含失败结果信息，有时也会有成功结果信息，
   * 后续需根据需求来实现
   * 如果只要失败结果，后端就不要把成功结果返回回来了
   * 如果只要成功结果，后端就不要把失败结果返回回来了
   */
  private _resultList: T[] = [];
  get ResultList() {
    if (this._getResultList) {
      return this._getResultList(this);
    }

    return this._resultList;
  }

  constructor(task: BatchTaskDto<T>) {
    this._taskId = task.batch_id;
    this._type = task.type;
    this._resultList = task.list;
    this._filePath = task.file_path;
    this._failedNumber = task.fail_num;
    this._successNumber = task.success_num;
    this._total = task.total_num;
    this._status = task.status;
  }

  protected _getResultList?: (task: BatchTask<T>) => T[];

  registerGetResultList(fn: (task: BatchTask<T>) => T[]) {
    this._getResultList = fn;
    return this;
  }

  /**
   * 获取任务进度信息
   * @param taskId 任务id
   * note:注意这是个抽象方法，必须在子类中被实现，每个模块获取进度的接口不一样
   */
  protected abstract getTaskProgress(taskId: string): Promise<BatchTaskDto<T>> | BatchTaskDto<T>;
  /**
   * 返回的结果弹窗，包含成功个数，失败个数，或者下载失败excel等，子类中必须实现
   */
  abstract getTaskResultModal(options?: TaskResultModalOptions): ReactNode;

  /**
   * 做取消接口用的
   */
  #getAbortSignal?: () => AbortSignal | undefined;

  async #updateTaskProgress(taskId: string) {
    const task = await this.getTaskProgress(taskId);
    this._taskId = task.batch_id;
    this._type = task.type;
    this._status = task.status;
    this._successNumber = task.success_num;
    this._failedNumber = task.fail_num;
    this._total = task.total_num;
    this._resultList = task.list;
    this._filePath = task.file_path;
    return this;
  }

  registerAbortSignal(fn: () => AbortSignal | undefined) {
    this.#getAbortSignal = fn;
    return this;
  }
  /**
   * 自动轮询任务状态，直到任务完成
   * @param task 当前获取到的任务
   * @param options
   */
  async takeUntilCompleted(options?: { minWait?: number }) {
    if (this._type === BatchTaskType.同步) {
      return this;
    }
    while (this._status === BatchTaskStatus.处理中) {
      const timer = createTimer(options?.minWait ?? 1000);
      const task = await this.#updateTaskProgress(this._taskId);
      if (task.Status === BatchTaskStatus.已完成) {
        this.emitComplete();
        break;
      }
      await timer;
      if (process.env["NODE_ENV"] === "development") {
        if (!this.#getAbortSignal) {
          console.warn(
            "未注册 AbortSignal，可能会导致无限循环，请调用 BatchTask.registerAbortSignal 来注册一个 AbortSignal"
          );
        }
      }
      const signal = this.#getAbortSignal?.();
      if (signal?.aborted) {
        break;
      }
    }
    return this;
  }
  /**
   * 成功的回调，待理解什么意思
   */
  protected _onCompleteCallbacks = new Set<() => void>();
  // task.onComplete使用，还需要在看看
  onComplete(cb: () => void) {
    this._onCompleteCallbacks.add(cb);
    return {
      dispose: () => {
        this._onCompleteCallbacks.delete(cb);
      },
    };
  }
  /**
   * 轮询时，已完成会执行这个方法
   */
  private emitComplete() {
    for (const cb of this._onCompleteCallbacks) {
      cb();
    }
  }
}

/**
 * 批量导入任务类,比BatchTask多一个label参数
 */
export abstract class BatchImportTask<T extends BatchTaskResult = BatchTaskResult> extends BatchTask<T> {
  /**
   * 任务模块
   */
  protected _label: string;
  get Label() {
    return this._label;
  }
  constructor(task: ImportTaskDto<T>) {
    super(task);
    this._label = task.label;
  }
  /**
   * 获取任务进度信息
   * @param taskId 任务 ID
   */
  protected getTaskProgress(taskId: string) {
    return batchTaskService.getImportTaskProgress<T>(this._label, taskId);
  }
}

export type TableColumns<T> = NonNullable<TableProps<T>["columns"]>;
export interface TaskResultModalOptions {
  columns?: TableColumns<BatchTaskResult>;
  downloadManager?: DownloadManager;
}

/**
 * 创建一个计时器
 *
 * @param ms 等待时间
 * @returns
 */
export async function createTimer(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}
