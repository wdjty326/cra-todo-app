import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { css } from "@emotion/react";

import Header from "../components/Header";
import OutlineButton from "../components/OutlineButton";
import Section from "../components/Section";
import EditStyled from "../components/EditStyled";

import { getTodo, updateTodo } from "./remotes";
import { toDateShortString } from "../libs/function";
import AlertScreen from "../components/AlertScreen";

const toDate = toDateShortString();

const EditPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [dueDate, setDueDate] = useState<string>('');

    const [ready, setReady] = useState(false);
    const [errMsg, setErrMsg] = useState<string>('');

    useEffect(() => {
        if (!id) return;
        const fetchTodo = async () => {
            await Promise.resolve();
            try {
                const resp = await getTodo(Number(id));
                setTitle(resp.title);
                setContent(resp.content);
                setDueDate(resp.dueDate);
                setReady(true);
            } catch (e) {
                setErrMsg('To-Do 정보를 가져오지 못했습니다. 이전페이지로 돌아갑니다.');
            }
        };
        fetchTodo();
    }, [id]);

    const editTodoEvent = async () => {
        await Promise.resolve();
        try {
            if (!title) return setErrMsg('제목은 필수입니다.');
            const resp = await updateTodo(
                Number(id),
                {
                    title,
                    content,
                    dueDate,
                },
            );
            if (resp) navigate('/');
        } catch (e) {
            setErrMsg('To-Do 정보를 변경하지 못했습니다. 다시 시도해주세요.');
        }
    };

    const resetErrMsg = () => setErrMsg('');

    return <>
        <Header>
            <h1>To-Do</h1>
        </Header>
        <Section css={css`
            display: flex;
            flex-direction: column;
            gap: 1em;
            min-height: calc(100vh - 70px - 2em);
        `}>
            <EditStyled.InputLine>
                <EditStyled.Label>제목</EditStyled.Label>
                <EditStyled.Input
                    type="text"
                    value={title}
                    aria-label="title"
                    required
                    onChange={(e) => {
                        const value = (e.target as HTMLInputElement).value;
                        setTitle(value);
                    }}
                />
            </EditStyled.InputLine>
            <EditStyled.InputLine>
                <EditStyled.Label>내용</EditStyled.Label>
                <EditStyled.TextArea
                    value={content}
                    aria-label="content"
                    onChange={(e) => {
                        const value = (e.target as HTMLTextAreaElement).value;
                        setContent(value);
                    }}
                />
            </EditStyled.InputLine>
            <EditStyled.InputLine css={css`
                flex: 1 1;
            `}>
                <EditStyled.Label>Due Date(Option)</EditStyled.Label>
                <EditStyled.Input
                    type="date"
                    value={dueDate}
                    min={toDate}
                    max="2099-12-31"
                    aria-label="duedate"
                    onChange={(e) => {
                        const value = (e.target as HTMLInputElement).value;
                        setDueDate(toDate > value ? toDate : value);
                    }}
                />
            </EditStyled.InputLine>
            <OutlineButton
                css={css`
                margin: 0;
                `}
                aria-label="edit"
                onClick={editTodoEvent}
            >
                저장
            </OutlineButton>
        </Section>
        {errMsg && <AlertScreen
            // title을 가져오지 못했다면 처음 페이지로 이동합니다.
            onClick={() => ready ? resetErrMsg() : navigate('/')}
        >
            {errMsg}
        </AlertScreen>}
    </>
};
export default EditPage;