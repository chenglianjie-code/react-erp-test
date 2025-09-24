// src/pages/page2.tsx
import { Button } from "antd";
import { userService } from "@/features/user";
import { ScrollContainerProvider, useScrollContainerRef } from "@/features/scroll-container";
import { Child } from "./page2-child";
import { useMutation } from "@tanstack/react-query";
import { useAbortControllerRef } from "@/features/shared";

export function Page2() {
  const [scroller, scrollerRef] = useScrollContainerRef();
  const abortRef = useAbortControllerRef();
  const {
    mutateAsync: importCreate,
    isPending: isLoading,
    isSuccess,
  } = useMutation({
    mutationFn: async () => {
      const task = await userService.importCreate();
      task.registerAbortSignal(() => abortRef.current?.signal);
      await task.takeUntilCompleted();
      return task;
    },
  });
  return (
    <ScrollContainerProvider value={scroller}>
      <div ref={scrollerRef} style={{ overflowY: "auto", height: "200px" }}>
        <div>我是测试内容</div>
        <Button
          type="primary"
          onClick={async () => {
            const task = await importCreate();
            if (task.IsCompleted) {
              console.log("成功了");
              return;
            }
          }}
        >
          用户导入(有label)
        </Button>
        <Child></Child>
      </div>
    </ScrollContainerProvider>
  );
}
