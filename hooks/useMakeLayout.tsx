import { FC, ReactNode } from "react";

export default function(LayoutComponent: ({children}: {children:any}) => JSX.Element) {
    return (page: any) => (
        <LayoutComponent>
            {page}
        </LayoutComponent>
    )
}