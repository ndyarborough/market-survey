import axios from 'axios';

const api = {
    registerUser: (newUser) => {
        console.log(newUser)
        const { firstName, lastName, email, password, password2 } = newUser;
        
        axios.post('http://localhost:4000/users/register', {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            password2: password2
        })
            .then(result => {
                console.log(result)
            })
            .catch(err => console.log(err))
    },

}

export default api;