import { DefaultBodyType, http, HttpHandler, HttpResponse, HttpResponseResolver, PathParams } from 'msw';
import { originTodoList } from './__origin__/todoList';
import { toDateShortString } from '../libs/function';

let todoList = (() => {
    const todoList = localStorage.getItem('_todoList');
    if (!todoList) {
        localStorage.setItem('_todoList', JSON.stringify(originTodoList));
        return originTodoList;
    }
    return JSON.parse(todoList) as TodoItem[];
})();
const updateTodoStorage = () => localStorage.setItem('_todoList', JSON.stringify(todoList));

const deley = (time: number) => new Promise(resolve => setTimeout(resolve, time));

const getWeatherList: HttpResponseResolver<PathParams, DefaultBodyType, undefined> = async () => {
    const currentDate = new Date();
    const am = currentDate.getHours() < 12;
    let hours = '0600'; // 하루전 0600 or 1800만 조회 가능
    if (currentDate.getHours() < 6) {
        currentDate.setDate(currentDate.getDate() - 1);
        hours = '1800';
    }
    const tmFc = `${toDateShortString(currentDate).replace(/-/g, "")}${hours}`;

    // 기상청 날씨 상태 API
    const midLandFcst = await fetch('https://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst?serviceKey=jhpnUtcWRcUuDrBYHJ29oi6X2DEHjykivp69raT4r4PZsWgm%2Fz3xX7Do0DlyZQBgAdqR1%2B1N%2Fq42rlma8oRrLw%3D%3D&pageNo=1&numOfRows=7&dataType=JSON&regId=11B00000&tmFc=' + tmFc)
        .then(resp => resp.json())
        .then(result => {
            if (result.response.header.resultCode === "00") {
                return Object.keys(result.response.body.items.item[0])
                    // 현재시각 여부에따라 금일 오전 / 오후 날씨만 예외처리
                    .filter(key => key.startsWith("wf") && (!key.endsWith("Am") || (am && key === "wf3Am") || (!am && key === "wf3Pm")))
                    .map(key => result.response.body.items.item[0][key]) as string[];
            }
            return [];
        });

    // 기상청 기온 상태 API
    const midTa = await fetch('https://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa?serviceKey=jhpnUtcWRcUuDrBYHJ29oi6X2DEHjykivp69raT4r4PZsWgm%2Fz3xX7Do0DlyZQBgAdqR1%2B1N%2Fq42rlma8oRrLw%3D%3D&pageNo=1&numOfRows=7&dataType=JSON&regId=11B10101&tmFc=' + tmFc)
        .then(resp => resp.json())
        .then(result => {
            // 최고기온만을 가져옵니다.
            if (result.response.header.resultCode === "00") {
                return Object.keys(result.response.body.items.item[0])
                    .filter(key => key.startsWith("taMax") && !key.endsWith("High") && !key.endsWith("Low"))
                    .map(key => result.response.body.items.item[0][key]) as number[];
            }
            return [];
        });

    return HttpResponse.json(Array(midTa.length).fill(0).map((_, index) => {
        const date = new Date();
        date.setDate(date.getDate() + index);

        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const week = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];

        return {
            date: `${month}/${day}(${week})`,
            ta: midTa[index],
            fsct: midLandFcst[index],
        }
    }), { status: 200 });
};

const getTodoList: HttpResponseResolver<PathParams, DefaultBodyType, undefined> = async () => {
    await deley(300);
    return HttpResponse.json(todoList, { status: 200 });
};

const getTodo: HttpResponseResolver<PathParams, DefaultBodyType, undefined> = async ({ params }) => {
    if (params.id === '') {
        return new HttpResponse(null, { status: 404 });
    }

    const todo = todoList.find(todo => Number(params.id) === todo.id);
    if (!todo) {
        return new HttpResponse(null, { status: 404 });
    }

    await deley(300);
    return HttpResponse.json(todo, { status: 200 });
};

const addTodo: HttpResponseResolver<PathParams, DefaultBodyType, undefined> = async () => {
    const nextIdx = todoList.reduce((current, prev) => Math.max(prev.id, current), 0) + 1;
    const todoItem = {
        id: nextIdx,
        title: '이번주 투두',
        content: '',
        checked: false,
        dueDate: '',
    };
    todoList = [
        todoItem,
        ...todoList,
    ];

    await deley(300);
    updateTodoStorage();
    return HttpResponse.json(todoItem, { status: 201 });
};

const deleteTodo: HttpResponseResolver<PathParams, DefaultBodyType, undefined> = async ({ params }) => {
    if (params.id === '') {
        return new HttpResponse(null, { status: 404 });
    }

    const index = todoList.findIndex(todo => Number(params.id) === todo.id);
    if (index !== -1) {
        todoList.splice(index, 1);
    }

    await deley(300);
    updateTodoStorage();
    return new HttpResponse(null, { status: 200 });
};

const updateTodo: HttpResponseResolver<PathParams, {
    title: string;
    content: string;
    dueDate: string;
} | {
    checked: boolean;
}, undefined> = async ({ params, request }) => {
    if (params.id === '') {
        return new HttpResponse(null, { status: 404 });
    }

    const index = todoList.findIndex(todo => Number(params.id) === todo.id);
    if (index !== -1) {
        const updated = await request.json();
        todoList[index] = {
            ...todoList[index],
            ...updated,
        };
    }

    await deley(300);
    updateTodoStorage();
    return HttpResponse.json(null, { status: 200 });
};

export const handlers: HttpHandler[] = [
    http.get('/api/weathers', getWeatherList),
    http.get('/api/todos', getTodoList),
    http.get('/api/todo/:id', getTodo),
    http.put('/api/todo', addTodo),
    http.delete('/api/todo/:id', deleteTodo),
    http.post('/api/todo/:id', updateTodo),
];