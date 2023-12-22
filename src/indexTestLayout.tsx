/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import AppTestLayout from "./app/AppTestLayout";

const [body] = document.getElementsByTagName("body");

render(() => <AppTestLayout />, body);
