import api from '../api';

// Make call to dispatch using thunk middleware
export const registerAttempt = (newUser) => {
    return function(dispatch) {
        api.registerUser(newUser);
        // .then(results => {
        //     // dispatch({type: , payload})   ?         
        // })
        // .catch(err => {
        //     // dispatch({type: , payload})
        // });
    }
}