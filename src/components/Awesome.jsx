import {Fragment} from 'react';

export const AwesomeButton = ({ icon, style, className }) => {
    return (
        <div className={className}>
            <button className="awesome">
                <span><i className={"fas fa-" + icon} style={style} ></i></span>
            </button>
        </div>
        )
}

export const AwesomeSidebar = ({ icon, text, selected }) => {
    return (
        <Fragment>
            <i className={"fas fa-" + icon}></i>
            <span>{text}</span>
        </Fragment>
    )
}

export const AwesomeIcon = ({ icon }) => {
    return (
        <i 
            className={"fas fa-" + icon}
            style={{ width: "16px", height:"16px"}}></i>
    );
}

export const AwesomeSpinner = ({ icon }) => {
    return (
        <i 
            className={"my-3 fas fa-5x fa-pulse fa-" + icon}
            style={{color:"var(--bs-success)"}}>
        </i>
    );
}