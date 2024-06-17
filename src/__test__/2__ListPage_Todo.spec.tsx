import {
    render, screen, waitFor
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ListPage from "../pages/ListPage";
import { originTodoList } from "../mocks/__origin__/todoList";

import * as remotes from "../pages/remotes";
import originWeatherList from "../mocks/__origin__/weatherList";
import ListPageTodo from "../pages/ListPageTodo";
import { GlobalPortal } from "../GlobalPortal";

const mockRouterPush = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        id: '1',
    }),
    useNavigate: () => mockRouterPush,
}));

const setup = () => {
    return render(<ListPageTodo />, {
        wrapper: props => <GlobalPortal.Provider>
            <MemoryRouter initialEntries={['/']}>
                {props.children}
            </MemoryRouter>
        </GlobalPortal.Provider>
    });
};

describe('2. #1_목록 > 이번주 할 일', () => {
    test('2-1. To-Do 가져오기 API가 올바르게 호출됐는지 테스트합니다.', async () => {
        const mockedRemoteFn = jest.spyOn(remotes, 'getTodoList')
            .mockReturnValue(new Promise(res => res(originTodoList)));
        setup();

        await waitFor(() => {
            expect(screen.getByText(originTodoList[1].title)).toBeInTheDocument();
        });
        expect(mockedRemoteFn).toHaveBeenCalled();
        originTodoList.map(todo => {
            expect(screen.getByText(todo.title)).toBeInTheDocument();
        });
    });

    test('2-2. 추가 버튼을 선택하면 To-Do가 생성되는지 테스트합니다.', async () => {
        jest.spyOn(remotes, 'getTodoList')
            .mockReturnValue(new Promise(res => res(originTodoList)));
        const nextIdx = originTodoList.reduce((current, prev) => Math.max(prev.id, current), 0) + 1;
        jest.spyOn(remotes, 'addTodo')
            .mockReturnValue(new Promise(res => res({
                id: nextIdx,
                title: '이번주 투두',
                content: '',
                checked: false,
                dueDate: '',
            })));

        setup();
        await waitFor(() => {
            expect(screen.getByText(originTodoList[0].title)).toBeInTheDocument();
        });
        await userEvent.click(screen.getByLabelText('add'));
        await waitFor(() => {
            const items = screen.getAllByTestId('todo-item');
            expect(items).toHaveLength(3);
        });
    });

    test('2-3. 저장된 To-Do 가 없으면 별도 텍스트를 노출하는지 테스트합니다.', async () => {
        jest.spyOn(remotes, 'getTodoList')
            .mockReturnValue(new Promise(res => res([])));

        setup();
        await waitFor(() => {
            expect(screen.getByText('저장된 TO-DO가 없습니다.')).toBeInTheDocument();
        });
    });

    test('2-4. To-Do 항목에 dueDate가 없으면 텍스트가 숨겨지는지 테스트합니다.', async () => {
        jest.spyOn(remotes, 'getTodoList')
            .mockReturnValue(new Promise(res => res([{
                dueDate: '',
                checked: false,
                content: '',
                id: 1,
                title: '오늘의 투두'
            }])));

        setup();
        await waitFor(() => {
            expect(screen.getByText('오늘의 투두').closest('div')?.children).toHaveLength(1);
        });
    });

    test('2-5. To-Do 항목이 선택되면 #2_편집 화면으로 이동하는지 테스트합니다.', async () => {
        jest.spyOn(remotes, 'getTodoList')
            .mockReturnValue(new Promise(res => res(originTodoList)));

        setup();
        await waitFor(() => {
            expect(screen.getByText(originTodoList[0].title)).toBeInTheDocument();
        });
        await userEvent.click(screen.getByText(originTodoList[0].title));
        await waitFor(() => {
            expect(mockRouterPush.mock.calls[0][0]).toStrictEqual(expect.stringContaining('/edit/' + originTodoList[0].id));
        });
    });

    test('2-6. 완료된 To-Do 리스트의 스타일이 strike로 적용되는지 테스트합니다.', async () => {
        jest.spyOn(remotes, 'getTodoList')
            .mockReturnValue(new Promise(res => res([{
                checked: true,
                content: '',
                dueDate: '2024-06-01',
                id: 0,
                title: '오늘의 투두',
            }])));

        setup();
        await waitFor(() => {
            const checkedCheckbox = screen.getByRole('checkbox', { checked: true });
            const parentItem = checkedCheckbox.closest('div');
            expect(parentItem).toHaveStyle('text-decoration: line-through');
        });
    });

    test('2-7. 완료되지 않은 To-Do 항목의 due date가 오늘 또는 그 이전인 경우, 폰트 컬러가 red로 변경되는지 테스트합니다.', async () => {
        jest.spyOn(remotes, 'getTodoList')
            .mockReturnValue(new Promise(res => res([{
                checked: false,
                content: '',
                dueDate: '2024-05-31',
                id: 0,
                title: '오늘의 투두',
            }])));

        setup();
        await waitFor(() => {
            const checkedCheckbox = screen.getByRole('checkbox', { checked: false });
            const parentItem = checkedCheckbox.closest('div');
            expect(parentItem).toHaveStyle('color: red');
        });
    });

    test('2-8. TO-DO 제거시 리스트에서 제거되는 지 테스트합니다.', async () => {
        jest.spyOn(remotes, 'getTodoList')
            .mockReturnValue(new Promise(res => res(originTodoList)));
        jest.spyOn(remotes, 'deleteTodo')
            .mockReturnValue(new Promise(res => res(true)));

        setup();
        await waitFor(() => {
            expect(screen.getAllByLabelText('delete')[0]).toBeInTheDocument();
        });
        await userEvent.click(screen.getAllByLabelText('delete')[0]);
        await waitFor(() => {
            const items = screen.getAllByTestId('todo-item');
            expect(items).toHaveLength(1);
        });
    });

    test('2-9. TO-DO 제거시 실패시 팝업을 출력하는지 테스트합니다.', async () => {
        jest.spyOn(remotes, 'getTodoList')
            .mockReturnValue(new Promise(res => res(originTodoList)));
        jest.spyOn(remotes, 'deleteTodo')
            .mockRejectedValue(new Error());

        setup();
        await waitFor(() => {
            expect(screen.getAllByLabelText('delete')[0]).toBeInTheDocument();
        });
        await userEvent.click(screen.getAllByLabelText('delete')[0]);
        await waitFor(() => {
            expect(screen.getByText('To-Do를 제거하지 못했습니다. 다시시도해주세요.')).toBeInTheDocument();
        });
    });

    test('2-10. TO-DO 추가 실패시 팝업을 출력하는지 테스트합니다.', async () => {
        jest.spyOn(remotes, 'getTodoList')
            .mockReturnValue(new Promise(res => res(originTodoList)));
        jest.spyOn(remotes, 'addTodo')
            .mockRejectedValue(new Error());

        setup();
        await waitFor(() => {
            expect(screen.getByText(originTodoList[0].title)).toBeInTheDocument();
        });
        await userEvent.click(screen.getByLabelText('add'));
        await waitFor(() => {
            expect(screen.getByText('To-Do를 생성하지 못했습니다. 다시 시도해주세요.')).toBeInTheDocument();
        });
    });

    test('2-11. 체크박스 선택시 TO-DO 상태가 변경되는지 테스트합니다.', async () => {
        jest.spyOn(remotes, 'getTodoList')
            .mockReturnValue(new Promise(res => res([originTodoList[0]])));
        jest.spyOn(remotes, 'updateTodo')
            .mockResolvedValue(new Promise(res => res(true)));

        setup();
        await waitFor(() => {
            expect(screen.getByText(originTodoList[0].title)).toBeInTheDocument();
        });
        await userEvent.click(screen.getByRole('checkbox', { checked: false }));
        await waitFor(() => {
            expect(screen.getByRole('checkbox', { checked: true })).toBeInTheDocument();
        });
    });

    test('2-12. 체크박스 선택 실패시 팝업을 출력하는지 테스트합니다.', async () => {
        jest.spyOn(remotes, 'getTodoList')
            .mockReturnValue(new Promise(res => res([originTodoList[0]])));
        jest.spyOn(remotes, 'updateTodo')
            .mockRejectedValue(new Error());

        setup();
        await waitFor(() => {
            expect(screen.getByText(originTodoList[0].title)).toBeInTheDocument();
        });
        await userEvent.click(screen.getByRole('checkbox', { checked: false }));
        await waitFor(() => {
            expect(screen.getByText(`선택하신 To-Do를 ${!originTodoList[0].checked ? '체크' : '해제'}하지 못했습니다.`)).toBeInTheDocument();
        });
    });

    test('2-13. To-Do 가져오기 API가 실패시 다시 요청하는 버튼을 추가합니다.', async () => {
        jest.spyOn(remotes, 'getTodoList')
            .mockRejectedValue(new Error());
        setup();

        await waitFor(() => {
            expect(screen.getByText('To-Do 리스트를 가져오지 못했습니다. 다시 시도해주세요.')).toBeInTheDocument();
        });
        expect(screen.getByLabelText('reload')).toBeInTheDocument();
    });

});
export { };