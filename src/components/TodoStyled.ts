import styled from "@emotion/styled";

// TO-DO 스타일
const TodoStyled = {
    List: styled.ul`
    width: 100%;
    background: #efefef;
    transform: translateX(-1em);
       padding: 1em;
    li + li {
        margin-top: 1em;
    }
    `,
    Box: styled.div`
    display: flex;
    flex-direction: row;
    gap: 1em;
    align-items: center;
    
    `,
    Text: styled.div`
    flex: 1 1;

    display: flex;
    flex-direction: column;
    gap: .5em;
    `,
    Button: styled.button`
    background-color: transparent;
    border: 0;
    padding: 0;
    `,
};
export default TodoStyled;