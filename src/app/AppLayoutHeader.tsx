import { Component, JSXElement } from "solid-js";

type TProps = {
  title: string;
  nav: JSXElement;
};

const AppLayoutHeader: Component<TProps> = (props) => {
  return (
    <div class="flex justify-between h-12">
      <div class="grow flex bg-stone-300">{props.nav}</div>
      <h1 class="flex min-w-[20%] bg-rose-800 px-2 font-bold text-lg text-stone-100">
        <p class="m-auto">{props.title}</p>
      </h1>
    </div>
  );
};

export default AppLayoutHeader;
