import axios from 'axios'
import { $ } from './bling'

function searchResultsHTML(businesses) {
    return businesses.map(business => {
        return `
            <tr>
                <td>${business.regNumber}</td>
                <td>${business.businessName}</td>
                <td>${business.natureOfBusiness}</td>
                <td>${business.state}</td>
                <td>${business.dateOfReg.split('T')[0]}</td>
                <td><a class='link__button' style='color:white;background-color: #1c330d; padding: 4px;' href='/admin/business/${business.businessName}/${business._id}'>VIEW</td>
            
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

    searchInput.on('keyup', event => {
        if (![13, 38, 40].includes(event.keyCode)) {
            return
        }
        const activeClass = 'search__result--active'
        const current = search.querySelector(`.${activeClass}`)
        const items = search.querySelectorAll('.search__result')
        let next
        if (event.keyCode === 40 && current) {
            next = current.nextElementSibling || items[0]
        } else if (event.keyCode === 40) {
            next = items[0]
        } else if (event.keyCode === 38 && current) {
            next = current.previousElementSibling || items[items.length - 1]
        } else if (event.keyCode === 38) {
            next = items[items.length - 1]
        } else if (event.keyCode === 13 && current.href) {
            window.location = current.href
            return
        }
        // console.log(next)
        if (current) {
            current.classList.remove(activeClass)
        }
        next.classList.add(activeClass)
    })
}

export default search