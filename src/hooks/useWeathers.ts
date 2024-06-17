import { useEffect, useState } from "react";
import { getWeatherList } from "../pages/remotes";
import { toDateLongString } from "../libs/function";

const useWeathers = () => {
    const [weathers, setWeathers] = useState<WeatherItem[]>([]);

    const [updated, setUpdated] = useState<string>('');
    const [errMsg, setErrMsg] = useState<string>('');

    useEffect(() => {
        if (updated) return;
        const fetchWeathers = async () => {
            await Promise.resolve(); //TODO::act issue 수정시 제거
            try {
                const resp = await getWeatherList();
                setWeathers(resp);
                setUpdated(toDateLongString().replace(/-/g, '.'));
            } catch (e) {
                setErrMsg('날씨를 가져오지 못했습니다. 다시 시도해주세요.');
            }
        };
        fetchWeathers();
    }, [updated]);

    const reloadWeathers = () => {
        setUpdated('');
        setErrMsg('');
    };

    return {
        weathers,
        updated,
        errMsg,

        reloadWeathers,
    };
};
export default useWeathers;