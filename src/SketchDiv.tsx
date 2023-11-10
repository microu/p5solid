import { Component } from "solid-js";
import { ISketchHandler} from "./SketchHandlers";

type TProps = {
    handler: ISketchHandler
}

const SketchDiv : Component<TProps> = (props) => {
    let divElt: HTMLDivElement| undefined; 

    const r = <div ref={divElt}></div>
    
    props.handler.run(divElt!)

    return r;
}

export default SketchDiv
