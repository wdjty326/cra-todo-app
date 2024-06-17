export const getWeatherList = (): Promise<WeatherItem[]> => {
    return fetch('/api/weathers', { method: 'GET' })
        .then(resp => resp.json());
};

export const getTodoList = (): Promise<TodoItem[]> => {
    return fetch('/api/todos', { method: 'GET' })
        .then(resp => resp.json());
};

export const getTodo = (id: number): Promise<TodoItem> => {
    return fetch(`/api/todo/${id}`, { method: 'GET' })
        .then(resp => resp.json());
};

export const addTodo = (): Promise<TodoItem> => {
    return fetch('/api/todo', { method: 'PUT' })
        .then(resp => resp.json());
};

export const deleteTodo = (id: number) => {
    return fetch(`/api/todo/${id}`, { method: 'DELETE' })
        .then(resp => resp.ok);
};

export const updateTodo = (
    id: number,
    body: Omit<TodoItem, "id" | "checked"> | Pick<TodoItem, "checked">) => {
    return fetch(
        `/api/todo/${id}`,
        {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'content-type': 'application/json',
            },
        })
        .then(resp => resp.ok);
};