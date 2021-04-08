import { Fragment } from "react"

import { ModuleTitle, ModuleSection, Submit } from "../BasicModule"

const fieldUpload = [{
    type: "file",
    icon: "upload",
    placeholder: "Elegi un archivo para importar"
}]
const fieldDownload = [{
    type: "button",
    icon: "download",
    button: {
        text: "Exportar"
    },
    placeholder: "Nombre del archivo a exportar"
}]

const Sincronizacion = () => {
    return (
        <Fragment>
            <ModuleTitle text="Sincronizacion"/>
            <div className="accordion" id="accordionSincronizacion">
                <ModuleSection
                    i={0}
                    sectionName="Importar"
                    section= { <Submit fields={fieldUpload} /> }
                    module={"Sincronizacion"}>
                </ModuleSection>
                <ModuleSection
                    i={1}
                    sectionName="Exportar"
                    section= { <input type="button" className="btn btn-success" value="Exportar" /> }
                    module={"Sincronizacion"}>
                </ModuleSection>
            </div>
        </Fragment>
    );
}

export default Sincronizacion;