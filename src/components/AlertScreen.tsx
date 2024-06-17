import styled from "@emotion/styled";
import { GlobalPortal } from "../GlobalPortal";
import { ReactNode } from "react";
import OutlineButton from "./OutlineButton";

const AlertScreenStyled = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .5);
`;

const AlertContentStyled = styled.div`
    max-width: 320px;
    margin: 1em auto;
    background-color: #ffffff;
    border-radius: 16px;
    padding: 1em 1em 0;
`;

const AlertTextStyled = styled.div`
    font-size: 15px;
    font-weight: 500;
`;

const AlertScreen = ({
    children,
    onClick,
}: {
    children: ReactNode;
    onClick(): void;
}) => {
    return <GlobalPortal.Consumer>
        <AlertScreenStyled>
            <AlertContentStyled>
                <AlertTextStyled>
                    {children}
                </AlertTextStyled>
                <OutlineButton aria-label="alert-button" onClick={onClick}>확인</OutlineButton>
            </AlertContentStyled>
        </AlertScreenStyled>
    </GlobalPortal.Consumer>
};
export default AlertScreen;