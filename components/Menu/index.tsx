import Workspace from "@layouts/Workspace";
import React, { CSSProperties, FC, useCallback } from "react";
import { CloseModalButton, CreateMenu } from "./styles";

interface Props {
    onCloseModal: (e: any) => void;
    style: CSSProperties;
    closeButton?: boolean;
}

const Menu: FC<Props> = ({children, style, closeButton, onCloseModal}) => {
    const stopPropagation = useCallback((e) => {
        e.stopPropagation();
    }, []);

    return (
        <CreateMenu>
            <div style={style} onClick={stopPropagation}>
                {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
                {children}
            </div>
        </CreateMenu>
    )
}

Menu.defaultProps = {
    closeButton: true,
}

export default Menu;