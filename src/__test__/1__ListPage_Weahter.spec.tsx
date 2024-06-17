import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import * as remotes from "../pages/remotes";
import originWeatherList from "../mocks/__origin__/weatherList";
import ListPageWeather from "../pages/ListPageWeather";

const setup = () => {
    return render(<ListPageWeather />, {
        wrapper: props => <MemoryRouter initialEntries={['/']}>
            {props.children}
        </MemoryRouter>
    });
};

describe('1. #1_목록 > 이번주 날씨', () => {
    test('1-1. 날씨 가져오기 API가 올바르게 호출됐는지 테스트합니다.', async () => {
        const mockedRemoteFn = jest.spyOn(remotes, 'getWeatherList')
            .mockReturnValue(new Promise(res => res(originWeatherList)));

        setup();
        await waitFor(() => {
            expect(screen.getByText(originWeatherList[0].date)).toBeInTheDocument();
        });
        expect(mockedRemoteFn).toHaveBeenCalled();
        originWeatherList.map(weather => {
            expect(screen.getByText(weather.date)).toBeInTheDocument();
        });
    });

    test('1-2. 날씨에 아이콘이 출력되는지 테스트합니다.', async () => {
        jest.spyOn(remotes, 'getWeatherList')
            .mockReturnValue(new Promise(res => res(originWeatherList)));

        setup();
        await waitFor(() => {
            expect(screen.getByText(originWeatherList[0].date)).toBeInTheDocument();
        });
        expect(screen.getAllByTestId('svg-element')).toHaveLength(originWeatherList.length);
    });

    test('1-3. 날씨 정보를 새로 불러올 때, 사용자에게 피드백이 출력되는지 테스트합니다.', async () => {
        jest.spyOn(remotes, 'getWeatherList')
            .mockReturnValue(new Promise(res => res(originWeatherList)));

        setup();
        await waitFor(() => {
            expect(screen.getByText(originWeatherList[0].date)).toBeInTheDocument();
        });
        expect(screen.getByLabelText('updated')).toBeInTheDocument();
    });
    
    test('1-4. 날씨 가져오기 API가 실패시 다시 요청하는 버튼을 추가합니다.', async () => {
        jest.spyOn(remotes, 'getWeatherList')
            .mockRejectedValue(new Error());
        setup();

        await waitFor(() => {
            expect(screen.getByText('날씨를 가져오지 못했습니다. 다시 시도해주세요.')).toBeInTheDocument();
        });
        expect(screen.getByLabelText('reload')).toBeInTheDocument();
    });
});
export { };