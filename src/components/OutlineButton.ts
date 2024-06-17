
import styled from "@emotion/styled";

const OutlineButton = styled.button`
width: 100%;
height: 2.5em;
background-color: #08c68d;
border-radius: 16px;
border: 1px solid rgba(0, 0, 0, .1);
font-size: 15px;
color: #fff;
font-weight: 700;
margin: 1em 0;
transition: opacity 500ms ease-out;
:hover {
    opacity: .8;
}
`;
export default OutlineButton;