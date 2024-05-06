import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducers/notificationReducer'
import blogsReducer from './reducers/blogReducer'
import userReducer from './reducers/userReducer'
import loginReducer from './reducers/loginReducer'

const store = configureStore({
    reducer: {
        notification: notificationReducer,
        blogs: blogsReducer,
        users: userReducer,
        login: loginReducer
    }
})

export default store