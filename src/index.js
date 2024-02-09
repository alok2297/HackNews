import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from "./Login/Login"

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <App />
        <Routes>
          <Route path='/login' element={<Login/>} />
        </Routes>
    </BrowserRouter>
);
registerServiceWorker();

// if (module.hot) {
//     module.hot.accept();
// }
