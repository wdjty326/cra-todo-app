import { css } from "@emotion/react";

import Section from "../components/Section";
import useWeathers from "../hooks/useWeathers";
import WeatherIcon from "../components/WeatherIcon";
import OutlineButton from "../components/OutlineButton";

const ListPageWeather = () => {
    const { weathers, updated, errMsg, reloadWeathers } = useWeathers();

    return <Section>
        <h3>
            이번주 날씨
            {updated && <small aria-label="updated" css={css`
        font-widget: 400;
        font-size: 13px;
        color: #999999;
        margin-left: 8px;
        `}>업데이트 시간: {updated}</small>}
        </h3>
        <div css={css`
        width: calc(100% + 2em);
        transform: translateX(-1em);
        overflow: auto;
        scroll-behavior: smooth;
        margin-top: 1em;
    `}>
            {updated && <ul css={css`
        display: flex;
        flex-wrap: nowrap;
        gap: 1em;

        ::before {
            content: ' ';
            width: 1em;
            height: 0;
        }

        ::after {
            content: ' ';
            width: 1em;
            height: 0;
        }
        `}>
                {weathers.map(weather => <li
                    key={`weather-${weather.date}`}
                    css={css`
                        flex: 0 0 100px;
                        background-color: #efefef;
                        text-align:center;
                    `}
                >
                    <p>{weather.date}</p>
                    <p>
                        {weather.fsct}
                        <WeatherIcon
                            css={css`
                                margin-left: 4px;
                                vertical-align: text-bottom;
                            `}
                            fsct={weather.fsct}
                            size={20}
                            data-testid="svg-element"
                        />
                    </p>
                    <p>{weather.ta}도</p>
                </li>)}
            </ul>}
            {errMsg && <>
                {errMsg}
                <OutlineButton aria-label="reload" onClick={reloadWeathers}>
                    다시하기
                </OutlineButton>
            </>}
        </div>
    </Section>;
};
export default ListPageWeather;