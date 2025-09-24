/**
 * 模拟接口请求
 * @params data 接口返回成功的数据
 */

export const axios = <T>(data: T): Promise<{ data: T }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data,
      });
    }, 1500);
  });
};
