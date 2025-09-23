import React, { useState, useEffect, useRef, useContext, useCallback } from "react";
import { ScrollContainerContext } from "./scroll-container-context";

/**
 * 获取祖先滚动容器
 *
 * 祖先滚动容器可能会有多个，但是只会获取离得最近的一个
 */
export const useScrollContainer = () => {
  const value = useContext(ScrollContainerContext);

  return value ?? document.body;
};

/**
 * 获取祖先滚动容器的getter
 *
 * @returns 返回函数，返回值为元素
 * 场景举例，antd表格中，
 * sticky={{
 *     getContainer,
 *  }}
 */
export const useScrollContainerGetter = () => {
  const scroller = useScrollContainer();

  return useCallback(() => scroller ?? document.body, [scroller]);
};

/**
 * 获取祖先滚动容器的标记
 *
 * 示例用法
 *   const [scroller, scrollerRef] = useScrollContainerRef();
 *   <ScrollContainerProvider value={scroller}>
 *        <div ref={scrollerRef} className="min-h-0 flex-auto overflow-y-auto">
 *          {props.children}
 *        </div>
 *    </ScrollContainerProvider>
 *  scrollerRef 放入到div中的ref中，就获取到了div，scroller是scrollerRef.current
 */

export const useScrollContainerRef = () => {
  const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setScrollElement(scrollContainerRef.current);
  }, []);
  return [scrollElement, scrollContainerRef] as const;
};
