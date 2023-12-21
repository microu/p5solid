/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./app/App";

const [body] = document.getElementsByTagName("body");

render(() => <App />, body);
