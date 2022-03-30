import axios from 'axios'

async function realTimeStats(id) {
    try {
        const data = await axios.get(`/api/v1/task/${id}`)
        console.log(data)
    } catch (error) {
        alert(error)
    }
}

function display(data) {
    const date = data.dateOfReg.split('T')

    let tableRow = `
        <tr>
            <td>${data.regNumber}</td>
            <td>${data.businessName}</td>
            
            <td>${data.state}</td>
            <td>${date}</td>
            <td style='font-size: 12px; color: brown;'>${data.isTreated == true ? 'TREATED' : 'UNTREATED'}</td>
            <td><a href='/business/${data.slug}/${data._id}' style='color:white;background-color: #1c330d; padding: 4px;'>VIEW</a></td>
        </tr>
        `
    this.table.insertAdjacentHTML('afterbegin', tableRow)
}

export default realTimeStats