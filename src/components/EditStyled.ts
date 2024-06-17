import styled from "@emotion/styled";

const EditStyled = {
    InputLine: styled.div`
    display: flex;
    flex-direction: column;
    gap: .5em;
    `,
    Label: styled.label`
    font-size: 20px;
    font-weight: 500;
    `,
    Input: styled.input`
    height: 2em;
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, .1);
    padding: 0 .5em;
    font-size: 17px;
    `,
    TextArea: styled.textarea`
    height: 8em;
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, .1);
    padding: .5em;
    font-size: 15px;
    `,
};

export default EditStyled;