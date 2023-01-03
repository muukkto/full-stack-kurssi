const Search = (props) => {
    const handleSearch = (event) => {
      props.setNewSearch(event.target.value)
    }
  
    return (
      <div>
          filter shown with <input value={props.search} onChange={handleSearch}/>
      </div>
    )
}

export default Search