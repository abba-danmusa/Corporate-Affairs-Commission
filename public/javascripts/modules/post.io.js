import axios from 'axios'

export default function post() {
    axios.get('/posts')
        .then(res => {
            console.log('end point hit')
            console.log(res.data)
        })

}