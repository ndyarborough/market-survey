const initialState = {
    user: {
        id: null,
        email: null,
        firstName: 'Bob',
        lastName: null,
        password: null
    },
    adding: false,
    added: false,
    error: null
}

export default function reducer(state=initialState, action) {
    // eslint-disable-next-line
    switch(action.type) {
        case 'REGISTER_USER_ATTEMPT':{
            return {...state, adding: true}
        }
        case 'REGISTER_USER_FAILURE':{
            return {
                ...state,
                adding: false,
                error: action.payload
            }
        }
        case 'REGISTER_USER_COMPLETE':{
            return {
                ...state,
                adding: false,
                added: true,
                user: action.payload
            }
        }
    }
    return state;
}