import {
  matchQuery,
  MutationCache,
  QueryCache,
  QueryClient,
} from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 关闭在窗口获取焦点的时候刷新数据
      refetchOnWindowFocus: false,
      // 关闭自动重试
      retry: false,
      networkMode: 'always',
    },
    mutations: {
      networkMode: 'always',
    },
  },
  queryCache: new QueryCache({
    onError(error) {
      Promise.reject(error);
    },
  }),
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      const { mutationKey, meta } = mutation.options;

      if (mutationKey) {
        queryClient.invalidateQueries({
          queryKey: mutationKey,
        });
      }

      if (meta?.invalidates?.length) {
        queryClient.invalidateQueries({
          predicate: (query) => {
            return (
              meta.invalidates?.some(({ queryKey }) =>
                matchQuery({ queryKey }, query),
              ) ?? false
            );
          },
        });
      }
    },
  }),
});
