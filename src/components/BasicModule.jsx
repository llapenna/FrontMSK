import { AwesomeIcon } from "./Awesome"

export const ModuleTitle = ({text}) => {
    return (
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">{text}</h1>
        </div>
    );
}

export const Submit = ({fields}) => {
    return(
        fields.map( ({icon, placeholder, type, button}, i) => 
            <div key={i} className="input-group mb-3">
                <span 
                    className="input-group-text">
                    <AwesomeIcon icon={ icon }/>
                </span>
                { button != null &&
                <button 
                    class="btn btn-outline-secondary" 
                    type="button">
                    { button.text }
                </button> }
                <input
                    type={type}
                    className="form-control"
                    placeholder={placeholder}>
                </input>
            </div>
        )
    );
}

export const ModuleSection = ({i, sectionName, section, moduleName}) => {
    return (
        <div className="accordion-item">
            <h2 className="accordion-header" id={"heading" + i}>
                <button 
                    className="accordion-button" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target={"#collapse" + i} 
                    aria-expanded="false" 
                    aria-controls={"collapse" + i}>
                    { sectionName }
                </button>
            </h2>
            <div 
                id={"collapse" + i}
                className="accordion-collapse collapse show" 
                aria-labelledby={"heading" + i}
                data-bs-parent={"#accordion" + moduleName}>
                <div className="accordion-body">
                    { section }
                </div>
            </div>
        </div>
    );
}

const Module = ({module}) => {
    return (
        <main 
            className="col-md-9 ms-sm-auto col-lg-10 px-md-4" 
            role="main" >
            {module}
        </main>
    );
}

export default Module;