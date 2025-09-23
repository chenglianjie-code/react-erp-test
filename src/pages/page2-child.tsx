import { useScrollContainer } from "../components/scroll-container";
export const Child = () => {
  const scroll = useScrollContainer();
  return <div>页面2子内容，看下scroll是什么</div>;
};
