import axios from 'axios'
import { $ } from './bling'

function searchResultsHTML(businesses) {
    return businesses.map(business => {
        const isTreated = business.isTreated == true ? 'TREATED' : 'UNTREATED'
        const color = business.isTreated == true ? 'green' : 'brown'
        return `
            <tr>
                <td>${business.regNumber}</td>
                <td>${business.businessName}</td>
                
                <td>${business.state}</td>
                <td>${business.dateOfReg.split('T')[0]}</td>
                <td style='color:${color};font-size:12px;'>${isTreated}</td>
                <td><a class='link__button' style='color:white;background-color: #1c330d; padding: 4px;' href='/business/${business.businessName}/${business._id}'>VIEW</td>
            
        `
    }).join('')
}

function search(search) {
    if (!search) return
    const searchInput = search.querySelector('input[name="search"]')
    const searchResults = $('.search__results--table')
    const searchResultsTable = $('.search__results')
    const hidden = $('.hidden')
    const pagination = $('.pagination')
        // const searchResultsTable = $('.search__results--table')

    searchInput.on('input', function() {
        setInterval(() => {
            if (!this.value) {
                hidden.style.display = ''
                searchResultsTable.style.display = 'none'
                pagination.style.display = ''
                    // searchResultsHTML.style.display = 'none'
                return
            }

        }, 1000);

        searchResultsTable.style.display = ''
        searchResults.style.display = ''
        hidden.style.display = 'none'
        pagination.style.display = 'none'
            // searchResults.innerHTML = ''

        axios.get(`/admin/api/search?search=${this.value}`)
            .then(res => {
                if (res.data.length) {
                    searchResults.innerHTML = searchResultsHTML(res.data)

                    // searchResults.insertAdjacentHTML('afterbegin', searchResultsHTML(res.data))
                    return
                } else if (res.data.length == 0) {
                    searchResults.innerHTML = `<h1 class="search__result">No results for <strong>${this.value}</strong> found</h1>`
                }
            })
            .catch(err => {
                console.error(err)
            })
    })
}

export default search