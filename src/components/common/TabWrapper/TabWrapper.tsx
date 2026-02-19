
import type { ReactNode } from 'react';

export interface TabWrapperProps {
    children: ReactNode;
    containerClassNames?: string;
    containerId: string;
    containerTitle: string;
    innerContainerClassNames?: string;
}

const TabWrapper = ({ children }: TabWrapperProps) => {
    return (
        <>
        {children}
        </>
    );
};

export default TabWrapper;
