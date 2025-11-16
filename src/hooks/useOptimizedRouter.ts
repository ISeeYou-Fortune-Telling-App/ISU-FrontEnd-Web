import { useRouter } from 'next/navigation';
import { useCallback, useTransition } from 'react';

export function useOptimizedRouter() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const push = useCallback(
    (href: string) => {
      startTransition(() => {
        router.push(href);
      });
    },
    [router],
  );

  const replace = useCallback(
    (href: string) => {
      startTransition(() => {
        router.replace(href);
      });
    },
    [router],
  );

  return {
    push,
    replace,
    isPending,
    router,
  };
}
