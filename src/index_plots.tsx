/* @refresh reload */
import { render } from "solid-js/web";
import "./index.css";
import AppPlots from "./app/AppPlots";

const root = document.getElementById("root");

render(() => <AppPlots />, root!);
