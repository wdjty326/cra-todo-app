import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditPage from "../pages/EditPage";
import { MemoryRouter } from "react-router-dom";

import * as remotes from "../pages/remotes";
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
    return render(<EditPage />, {
        wrapper: props => <GlobalPortal.Provider>
            <MemoryRouter initialEntries={["/edit/1"]}>
                {props.children}
            </MemoryRouter>
        </GlobalPortal.Provider>
    });
};

const titleFieldLabelText = 'title';
const contentFieldLabelText = 'content';
const duedateFieldLabelText = 'duedate';

const today = new Date();

const year = today.getFullYear();
const month = (today.getMonth() + 1).toString().padStart(2, '0');
const day = today.getDate().toString().padStart(2, '0');

describe('3. #2_편집', () => {
    test('3-1. TO-DO 가져오기 API가 올바른 id로 호출됐는지 테스트합니다.', async () => {
        const mockedRemoteFn = jest.spyOn(remotes, 'getTodo')
            .mockReturnValue(new Promise(res => res({
                checked: false,
                content: '이번주 투두 컨텐츠 입니다.',
                dueDate: '2024-05-06',
                id: 1,
                title: '이번주 투두',
            })));
        setup();

        await waitFor(async () => {
            expect(screen.getByLabelText(titleFieldLabelText)).toHaveValue('이번주 투두');
            expect(screen.getByLabelText(contentFieldLabelText)).toHaveValue('이번주 투두 컨텐츠 입니다.');
            expect(screen.getByLabelText(duedateFieldLabelText)).toHaveValue('2024-05-06');
        });
        expect(mockedRemoteFn).toHaveBeenCalled();
    });

    test('3-2. 날짜 입력이 YYYY-MM-DD 형식으로 표출되는지 테스트합니다.', async () => {
        const input = `${year}-${month}-${day}`;
        setup();

        await userEvent.clear(screen.getByLabelText(duedateFieldLabelText));
        await userEvent.type(screen.getByLabelText(duedateFieldLabelText), input);
        await waitFor(() => {
            expect(screen.getByLabelText(duedateFieldLabelText)).toHaveValue(input);
        });
    });

    test('3-3. 날짜 입력이 현재시간 이후만 입력되는지 테스트합니다.', async () => {
        const input = '2024-01-01';
        await setup();

        await userEvent.clear(screen.getByLabelText(duedateFieldLabelText));
        await userEvent.type(screen.getByLabelText(duedateFieldLabelText), input);
        await waitFor(() => {
            expect(screen.getByLabelText(duedateFieldLabelText)).toHaveValue(`${year}-${month}-${day}`);
        });
    });

    test('3-4. 저장버튼을 누르면 #1_목록 화면으로 이동되는지 테스트합니다.', async () => {
        jest.spyOn(remotes, 'getTodo')
            .mockReturnValue(new Promise(res => res({
                checked: false,
                content: '이번주 투두 컨텐츠 입니다.',
                dueDate: '2024-05-06',
                id: 1,
                title: '이번주 투두',
            })));
        jest.spyOn(remotes, 'updateTodo').mockReturnValue(new Promise(res => res(true)));
        setup();

        await userEvent.click(screen.getByLabelText('edit'));
        await waitFor(() => {
            expect(mockRouterPush.mock.calls[0][0]).toStrictEqual(expect.stringContaining('/'));
        });
    });

    test('3-5. 정보를 가져오지 못했다면 팝업을 출력하고, 확인을 누르면 #1_목록 화면으로 이동되는지 테스트합니다.', async () => {
        jest.spyOn(remotes, 'getTodo')
            .mockRejectedValue(new Error());

        setup();
        await waitFor(() => {
            expect(screen.getByText('To-Do 정보를 가져오지 못했습니다. 이전페이지로 돌아갑니다.')).toBeInTheDocument();
        });
        await userEvent.click(screen.getByLabelText('alert-button'));
        await waitFor(() => {
            expect(mockRouterPush.mock.calls[0][0]).toStrictEqual(expect.stringContaining('/'));
        });
    });

    test('3-6. 저장버튼을 누를때 제목이 없으면 에러를 출력합니다.', async () => {
        jest.spyOn(remotes, 'getTodo')
            .mockReturnValue(new Promise(res => res({
                checked: false,
                content: '이번주 투두 컨텐츠 입니다.',
                dueDate: '2024-05-06',
                id: 1,
                title: '이번주 투두',
            })));
        setup();
        await waitFor(async () => {
            expect(screen.getByLabelText(titleFieldLabelText)).toHaveValue('이번주 투두');
        });
        await userEvent.clear(screen.getByLabelText(titleFieldLabelText));
        await userEvent.click(screen.getByLabelText('edit'));
        await waitFor(() => {
            expect(screen.getByText('제목은 필수입니다.')).toBeInTheDocument();
        });
    });

    test('3-7. 저장버튼을 누를때 실패시 에러를 출력합니다.', async () => {
        jest.spyOn(remotes, 'getTodo')
            .mockReturnValue(new Promise(res => res({
                checked: false,
                content: '이번주 투두 컨텐츠 입니다.',
                dueDate: '2024-05-06',
                id: 1,
                title: '이번주 투두',
            })));
        jest.spyOn(remotes, 'updateTodo')
            .mockRejectedValue(new Error());

        setup();
        await waitFor(async () => {
            expect(screen.getByLabelText(titleFieldLabelText)).toHaveValue('이번주 투두');
        });
        await userEvent.click(screen.getByLabelText('edit'));
        await waitFor(() => {
            expect(screen.getByText('To-Do 정보를 변경하지 못했습니다. 다시 시도해주세요.')).toBeInTheDocument();
        });
    });
});
export { };