function typeAhead(search) {
    if (!search) return
    const searchInput = search.querySelector('input[name="search"]')
    const searchResults = search.querySelector('.search__results')

    searchInput.on('input', function() {
        if (!this.value) {
            searchResults.style.display = 'none'
            return
        }

        searchResults.style.display = 'block'
        searchResults.innerHTML = ''

        axios.get(`/api/search?q=${this.value}`)
            .then(res => {
                if (res.data.length) {
                    searchResults.innerHTML = dompurify.sanitize(searchResultsHTML(res.data))
                    return
                }
                searchResults.innerHTML = dompurify.sanitize(`<div class="search__result">No results for ${this.value} found</div>`)
            })
            .catch(err => {
                console.error(err)
            })
    })
}