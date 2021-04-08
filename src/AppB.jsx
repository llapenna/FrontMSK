import React, {useState, Fragment} from 'react';

import Sidebar from "./components/Sidebar"
import Module from "./components/BasicModule"
import Navbar from "./components/Navbar"

const App = () => {
    const [module, setModule] = useState(null);

    return (
        <Fragment>
            <Navbar/>
            <div className="continer-fluid">
                <div className="row">
                    <Sidebar />
                    <Module />
                </div>
            </div>
        </Fragment>
    );
}

export default App