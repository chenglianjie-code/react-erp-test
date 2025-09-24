export type BatchTaskDto<T> = {
  batch_id: string;
  list: T[];
};
interface ImportTaskDto<T> extends BatchTaskDto<T> {
  label: string;
}

// 定义一个基类
export abstract class BatchTask<T> {
  protected _taskId: string;
  constructor(task: BatchTaskDto<T>) {
    this._taskId = task.batch_id;
  }
  protected getTaskId() {
    return this._taskId;
  }
}

// 继承类，实现多参数

export abstract class BatchImportTak<T> extends BatchTask<T> {
  /**
   * 任务模块
   */
  protected _label: string;
  constructor(task: ImportTaskDto<T>) {
    super(task);
    this._label = task.label;
  }
  protected getTaskId() {
    return this._taskId + this._label;
  }
}
