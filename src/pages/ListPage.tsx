import Header from "../components/Header";
import ListPageTodo from "./ListPageTodo";
import ListPageWeather from "./ListPageWeather";

const ListPage = () => {
    return <>
        <Header>
            <h1>
                This WEEK
            </h1>
            <h4>신나는 일주일을 계획합시다!</h4>
        </Header>

        <ListPageWeather />
        <ListPageTodo />
    </>;
};
export default ListPage;