import axios from 'axios'
import dompurify from 'dompurify'
import { $ } from './bling'

function searchResultsHTML(businesses) {
    return businesses.map(business => {
        return `
            <tr>
                <td>
                    <a href='/admin/business/${business.businessName}/${business._id}'> ${business.regNumber}
                </td>
                <td>
                    <a href='/admin/business/${business.businessName}/${business._id}'> ${business.businessName}
                </td>
                <td>
                    <a href='/admin/business/${business.businessName}/${business._id}'> ${business.natureOfBusiness}
                </td>
                <td>
                    <a href='/admin/business/${business.businessName}/${business._id}'> ${business.state}
                </td>
                <td>
                    <a href='/admin/business/${business.businessName}/${business._id}'> ${business.dateOfReg}
                </td>
        `
    }).join('')
}

function typeAhead(search) {
    if (!search) return
    const searchInput = search.querySelector('input[name="search"]')
    const searchResults = $('.search__results--table')
    const hidden = $('.hidden')
        // const searchResultsTable = $('.search__results--table')

    searchInput.on('input', function() {
        if (!this.value) {
            searchResults.style.display = 'none'
            searchResultsHTML.style.display = 'none'
            return
        }

        searchResults.style.display = 'block'
        hidden.style.display = 'none'
            // searchResults.innerHTML = ''

        axios.get(`/api/search?search=${this.value}`)
            .then(res => {
                if (res.data.length) {
                    searchResults.insertAdjacentHTML('afterbegin', searchResultsHTML(res.data))
                    return
                } else {
                    searchResults.innerHTML = `<div class="search__result">No results for ${this.value} found</div>`
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

export default typeAhead