import React, { ReactNode } from "react";

type ContainerProps = {
    children: ReactNode;
};

export const Container = ({children}:ContainerProps) => {
    return <div className="mx-auto w-full max-w-5xl px-4">
        {children}
        
    </div>
}