import { ReactNode, createContext, useState } from "react";
import { createPortal } from "react-dom";

const PortalContext = createContext<HTMLDivElement | null>(null);

const PortalProvider = ({ children }: {
    children: ReactNode;
}) => {
    const [portalContainerRef, setPortalContainerRef] = useState<HTMLDivElement | null>(null);

    return <PortalContext.Provider value={portalContainerRef}>
        {children}
        <div
            id="portal-container"
            ref={elem => {
                if (portalContainerRef !== null || elem === null) {
                    return;
                }

                setPortalContainerRef(elem);
            }}
        />
    </PortalContext.Provider>;
};

const PortalConsumer = ({ children }: {
    children: ReactNode;
}) => {
    return <PortalContext.Consumer>
        {portalContainerRef => {
            if (portalContainerRef === null) {
                return null;
            }

            return createPortal(children, portalContainerRef);
        }}
    </PortalContext.Consumer>;
};

export const GlobalPortal = {
    Provider: PortalProvider,
    Consumer: PortalConsumer,
};
