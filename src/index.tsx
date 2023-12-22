/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import AppHome from "./app/AppHome";

const [body] = document.getElementsByTagName("body");

render(() => <AppHome />, body);
