const SearchTodoForm = ({onSearch}) => {
    return <input placeholder="검색어를 입력하세요" onChange={(e) => onSearch(e.target.value)}/>;
}

export default SearchTodoForm;
