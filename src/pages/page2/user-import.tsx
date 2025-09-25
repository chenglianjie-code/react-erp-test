import { Button, message } from "antd";
import { userService } from "@/features/user";
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
    </div>
  );
};
