import type { TabWrapperProps } from '../TabWrapper/TabWrapper';
import './TabbedContainer.css';
import React from 'react';

interface TabbedContainerProps {
    activeTab: string;
    children: React.ReactElement<TabWrapperProps>[] | React.ReactElement<TabWrapperProps>;
    id: string;
    handleActiveTab: (event: any) => void;
}

const TabbedContainer = ({ activeTab, children, id, handleActiveTab }: TabbedContainerProps) => {
    return (
        <div id={id}>
            <div className="flex-row">
                <div className="tabbed-container-tab">
                    {React.Children.map(children, (child,index) => {
                        const currentContainerId = child.props.containerId;
                        const currentContainerTitle = child.props.containerTitle;
                        return (
                            <button key={index} className={`tabbed-container-tablinks ${activeTab === currentContainerId ? 'active' : ''}`} onClick={() => handleActiveTab(currentContainerId)}>{currentContainerTitle}</button>
                        );
                    })}
                </div>
            </div>
            <div className="flex-row tab-content-row">
                <div className="flex-column full-width">
                    {React.Children.map(children, (child, index) => {
                        const currentContainerId = child.props.containerId;
                        return (
                            <div key={index} id={currentContainerId} className={`tabbed-container-tabcontent ${activeTab === currentContainerId ? '' : 'hidden'} ${child.props.containerClassNames ?? ''}`}>
                                <div className={`inner-tabcontent-container ${child.props.innerContainerClassNames ?? ''}`}>
                                    {child}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TabbedContainer;
