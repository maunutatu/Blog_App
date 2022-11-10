import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import store from './store'
import {Provider} from 'react-redux'
import {BrowserRouter as Router} from 'react-router-dom'

// Provider fetches the Redux store

// Router is responsible for page routing

ReactDOM.createRoot(document.getElementById('root')).render(<Provider store={store}> <Router> <App/> </Router> </Provider>)
