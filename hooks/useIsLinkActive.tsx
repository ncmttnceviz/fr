import { useRouter } from "next/router";
import { useMemo } from "react";

export default function useIsLinkActive(href: string, nested: boolean = false) {
    const router = useRouter();
    const isActive = useMemo(() => {
        return !!(
            href &&
            router.asPath &&
            (!!nested ? router.asPath.startsWith(href) : href === router.asPath)
        );
    },[router.asPath])
    return isActive;
}