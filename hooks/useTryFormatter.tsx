import { useMemo } from "react";

export default function useTryFormatter(
  options:
    {
      minimiumFractionDigits: number,
      maximumFractionDigits: number
    } = {
      minimiumFractionDigits: 0,
      maximumFractionDigits: 0
    }
) {
  return useMemo(
    () =>
      Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        ...options
      }),
    []
  );
}
