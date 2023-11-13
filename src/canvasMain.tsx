/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import CanvasApp from "./CanvasApp";

const root = document.getElementById("root");

render(() => <CanvasApp />, root!);
