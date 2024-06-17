import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addTodo, deleteTodo, getTodoList, updateTodo } from "../pages/remotes";

const useTodoList = () => {
    const naviagte = useNavigate();
    const [todos, setTodos] = useState<TodoItem[]>([]);

    const [errMsg, setErrMsg] = useState<string>('');
    const [ready, setReady] = useState<boolean>(false);

    useEffect(() => {
        if (ready) return;
        const fetchTodos = async () => {
            await Promise.resolve(); //TODO::act issue 수정시 제거
            try {
                setTodos(await getTodoList());
                setReady(true);
            } catch (e) {
                setErrMsg('To-Do 리스트를 가져오지 못했습니다. 다시 시도해주세요.');
            }
        };
        fetchTodos();
    }, [ready]);

    const addTodoEvent = async () => {
        await Promise.resolve(); //TODO::act issue 수정시 제거
        try {
            const resp = await addTodo();
            if (resp) {
                setTodos(prev => [resp].concat(prev));
            }
        } catch (e) {
            setErrMsg('To-Do를 생성하지 못했습니다. 다시 시도해주세요.');
        }
    };
    const deleteTodoEvent = async (id: number) => {
        await Promise.resolve(); //TODO::act issue 수정시 제거
        try {
            const resp = await deleteTodo(id);
            if (resp) {
                setTodos(prev => {
                    const result = [...prev];
                    const index = prev.findIndex(_todo => _todo.id === id);
                    result.splice(index, 1);
                    return result;
                });
            }
        } catch (e) {
            setErrMsg('To-Do를 제거하지 못했습니다. 다시시도해주세요.');
        }
    };

    const updateTodoEvent = async (id: number, updateChecked: boolean) => {
        await Promise.resolve(); //TODO::act issue 수정시 제거
        try {
            const resp = await updateTodo(id, { checked: updateChecked });
            if (resp) {
                setTodos(prev => {
                    const result = [...prev];
                    const index = prev.findIndex(_todo => _todo.id === id);
                    result[index] = {
                        ...result[index],
                        checked: !result[index].checked
                    };
                    return result;
                });
            }
        } catch (e) {
            setErrMsg(`선택하신 To-Do를 ${updateChecked ? '체크' : '해제'}하지 못했습니다.`);
        }
    };

    const editTodoEvent = (id: number) => naviagte(`/edit/${id}`);

    const resetErrMsg = () => setErrMsg('');
    const reloadTodoList = () => {
        setReady(false);
        setErrMsg('');
    };

    return {
        todos,
        ready,
        errMsg,

        addTodoEvent,
        deleteTodoEvent,
        updateTodoEvent,
        editTodoEvent,

        reloadTodoList,
        resetErrMsg,
    };
};
export default useTodoList;