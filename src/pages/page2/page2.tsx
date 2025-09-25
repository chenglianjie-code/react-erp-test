import { ScrollContainerProvider, useScrollContainerRef } from "@/features/scroll-container";
import { Child } from "./page2-child";
import { UserImport } from "./user-import";

export function Page2() {
  const [scroller, scrollerRef] = useScrollContainerRef();

  return (
    <ScrollContainerProvider value={scroller}>
      <div ref={scrollerRef} style={{ overflowY: "auto", height: "200px" }}>
        <div>功能测试模块</div>
        {/* 用户导入，批量任务请求 */}
        <UserImport></UserImport>
        <Child></Child>
      </div>
    </ScrollContainerProvider>
  );
}
