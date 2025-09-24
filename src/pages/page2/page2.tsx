// src/pages/page2.tsx
import { ScrollContainerProvider, useScrollContainerRef } from "@/features/scroll-container";
import { Child } from "./page2-child";
export function Page2() {
  const [scroller, scrollerRef] = useScrollContainerRef();
  return (
    <ScrollContainerProvider value={scroller}>
      <div ref={scrollerRef} style={{ overflowY: "auto", height: "200px" }}>
        <div>我是页面2内容</div>
        <Child></Child>
      </div>
    </ScrollContainerProvider>
  );
}
