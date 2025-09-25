import { Button, message } from "antd";
import { userService, SubmitDownloadManager } from "@/features/user";
import { ScrollContainerProvider, useScrollContainerRef } from "@/features/scroll-container";
import { Child } from "./page2-child";
import { useMutation } from "@tanstack/react-query";
import { useAbortControllerRef } from "@/features/shared";
import { useState, ReactNode } from "react";

export const UserImport = () => {
  const [modalNode, setModalNode] = useState<ReactNode>(null);
  const abortRef = useAbortControllerRef();
  const { mutateAsync: importCreate, isPending } = useMutation({
    mutationFn: async () => {
      const task = await userService.importCreate();
      task.registerAbortSignal(() => abortRef.current?.signal);
      await task.takeUntilCompleted();
      return task;
    },
  });

  const { mutateAsync: batchImport, isPending: loading } = useMutation({
    mutationFn: async () => {
      const task = await userService.batchSubmit(1);
      task.registerAbortSignal(() => abortRef.current?.signal);
      await task.takeUntilCompleted();
      return task;
    },
  });

  return (
    <div>
      <Button
        loading={isPending}
        type="primary"
        onClick={async () => {
          const task = await importCreate();
          console.log("执行成功过后的task", task);
          if (task.IsCompleted) {
            message.success("操作成功");
          }
          if (task.FailedNumber) {
            const modal = task.getTaskResultModal();
            setModalNode(modal);
            // task.getTaskResultModal();
          }
        }}
      >
        用户导入(有label)
      </Button>
      {modalNode}
      <Button
        type="primary"
        className="ml-1"
        loading={loading}
        onClick={async () => {
          const task = await batchImport();
          console.log("批量提交执行成功过后的task", task);
          if (task.IsCompleted) {
            message.success("操作成功");
          }
          if (task.FailedNumber) {
            const modal = task.getTaskResultModal({
              downloadManager: new SubmitDownloadManager("批量提交失败订单", ["采购单号1", "失败原因"]),
            });
            setModalNode(modal);
            // task.getTaskResultModal();
          }
        }}
      >
        批量提交
      </Button>
    </div>
  );
};
