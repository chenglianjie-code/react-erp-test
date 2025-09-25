import { axios } from "@/features/axios";
import { BatchTaskStatus, BatchTaskType, BatchTaskDto } from "@/features/shared";
import { UserImportTask, PurchaseOrderBatchTask } from "./use-import-task";
export class UserService {
  /**
   * 模拟导入批量任务
   */
  async importCreate() {
    const { data } = await axios({
      uid: "915a2c99-aa63-41f4-a830-c9236caf0d31",
      type: "import",
      label: "user_import_create",
    });
    console.log("导入接口成功 - 返回的数据，拿到uid去轮询请求", data);
    return new UserImportTask({
      batch_id: data.uid,
      label: data.label,
      fail_num: 0,
      success_num: 0,
      total_num: 0,
      status: BatchTaskStatus.处理中,
      type: BatchTaskType.异步,
      file_path: "",
      list: [],
    });
  }

  /**
   * 批量提交
   */

  async batchSubmit(ids: number) {
    const { data } = await axios<BatchTaskDto>({
      type: BatchTaskType.异步,
      batch_id: "f6807f1b-02ad-4956-868d-499e0b9af2b4",
      status: BatchTaskStatus.处理中,
      success_num: 0,
      fail_num: 0,
      total_num: 1,
      list: [],
    });
    return new PurchaseOrderBatchTask(data);
  }
}

export const userService = new UserService();
