/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import AppTickRunnables from "./app/AppTickRunnables";

const [body] = document.getElementsByTagName("body");

render(() => <AppTickRunnables />, body);
