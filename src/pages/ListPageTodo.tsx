import { IoMdClose } from "react-icons/io";

import OutlineButton from "../components/OutlineButton";
import Section from "../components/Section";
import TodoStyled from "../components/TodoStyled";

import useTodoList from "../hooks/useTodoList";
import { toDateShortString } from "../libs/function";
import { GlobalPortal } from "../GlobalPortal";
import AlertScreen from "../components/AlertScreen";

const toDateString = toDateShortString();

const ListPageTodo = () => {
    const {
        todos,
        errMsg,
        ready,

        addTodoEvent,
        deleteTodoEvent,
        editTodoEvent,
        updateTodoEvent,

        reloadTodoList,
        resetErrMsg,
    } = useTodoList();

    return <Section>
        <h3>이번주 To-Do</h3>
        <OutlineButton
            aria-label="add"
            onClick={addTodoEvent}>
            추가 버튼
        </OutlineButton>
        {!ready && errMsg && <>
            {errMsg}
            <OutlineButton aria-label="reload" onClick={reloadTodoList}>
                다시하기
            </OutlineButton>
        </>}
        {ready && todos.length !== 0 ? <TodoStyled.List>
            {todos.map(todo => <li
                data-testid="todo-item"
                key={`todo-item-${todo.id}`}
            >
                <TodoStyled.Box
                    style={{
                        textDecoration: todo.checked ? 'line-through' : 'none',
                        color: !todo.checked && todo.dueDate && toDateString >= todo.dueDate ?
                            'red' :
                            ''
                    }}
                >
                    <input
                        type="checkbox"
                        checked={todo.checked}
                        onChange={() => updateTodoEvent(todo.id, !todo.checked)}
                    />
                    <TodoStyled.Text
                        onClick={() => editTodoEvent(todo.id)}
                    >
                        <h4>{todo.title}</h4>
                        {todo.dueDate && <span>due date: {todo.dueDate.replace(/-/g, ".")}</span>}
                    </TodoStyled.Text>
                    <TodoStyled.Button
                        aria-label="delete"
                        onClick={() => deleteTodoEvent(todo.id)}
                    >
                        <IoMdClose size="1.5em" />
                    </TodoStyled.Button>
                </TodoStyled.Box>
            </li>)}
        </TodoStyled.List> : <h3>저장된 TO-DO가 없습니다.</h3>}
        {ready && errMsg && <GlobalPortal.Consumer>
            <AlertScreen onClick={resetErrMsg}>
                {errMsg}
            </AlertScreen>
        </GlobalPortal.Consumer>}
    </Section>;
};
export default ListPageTodo;