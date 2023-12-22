import { Component, JSXElement } from "solid-js";
import HomeButton from "./ui/HomeButton";

type TProps = {
  title: string;
  nav: JSXElement;
};

const AppLayoutHeader: Component<TProps> = (props) => {
  return (
    <div class="flex justify-between h-12">
      <HomeButton href="/" class="text-red-800 hover:text-rose-600 bg-stone-300"/>
      <div class="grow flex bg-stone-300">{props.nav}</div>
      <h1 class="flex min-w-[20%] bg-stone-400 px-2 font-bold text-lg text-rose-950">
        <p class="m-auto">{props.title}</p>
      </h1>
    </div>
  );
};

export default AppLayoutHeader;
