/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import AppHomeCollatz from "./app/AppHomeCollatz";

const [body] = document.getElementsByTagName("body");

render(() => <AppHomeCollatz />, body);
