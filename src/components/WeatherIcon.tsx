import { IconBaseProps } from "react-icons";
import {
    TiWeatherSunny,
    TiWeatherCloudy,
    TiWeatherDownpour,
    TiWeatherPartlySunny,
    TiWeatherSnow,
} from "react-icons/ti";

const WeatherIcon = (props: {
    fsct: string;
} & IconBaseProps) => {
    const { fsct } = props;
    if (fsct === '맑음') return <TiWeatherSunny {...props} />;;
    if (fsct === '흐림') return <TiWeatherPartlySunny {...props} />;
    if (fsct === '구름많음') return <TiWeatherCloudy {...props} />;
    if (fsct === '비') return <TiWeatherDownpour {...props} />;
    if (fsct === '눈') return <TiWeatherSnow {...props} />;

    return null;
};
export default WeatherIcon;
