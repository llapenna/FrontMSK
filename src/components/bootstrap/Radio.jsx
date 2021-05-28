const Radio = ({buttons, checked = -1, handleChange}) => {

    return(
        <div>
            {buttons.map( ({id, name, text}, i) => 
                <div className="form-check" key={id}>
                    <input
                        className="form-check-input" 
                        type="radio" 
                        name={'radioTest'} 
                        id={`radio${name}`}
                        dataid={id}
                        onChange={(e) => handleChange(parseFloat(e.currentTarget.attributes['dataid'].value))}
                        {...{checked: (checked === -1 && i === 0) || checked === id}}/>
                    <label className="form-check-label" htmlFor={`radio${name}`}>
                        {text}
                    </label>
                </div>
            )}
        </div>
    )
}

export default Radio