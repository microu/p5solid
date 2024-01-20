import { Component, JSXElement, ParentProps } from "solid-js";
import AppLayoutHeader from "./AppLayoutHeader";
import AppLayoutFooter from "./AppLayoutFooter";

type TProps = {
  title: string;
  nav?: JSXElement;
  left?: JSXElement;
  right?: JSXElement;
};

const AppLayout: Component<ParentProps<TProps>> = (props) => {
  const titleElt = document.querySelector("head > title");

  if (titleElt != null) {
    titleElt.textContent = props.title;
  }

  const nav = props.nav ?? (
    <p class="my-auto pl-2 text-rose-950 text-lg font-bold">...</p>
  );

  const left = props.left ?? (
    <div class="h-full bg-stone-100">
    </div>
  );

  const right = props.right ?? (
    <div class="h-full bg-stone-100">
    </div>
  );

  // "declare" tailwind classes

  return (
    <div class="flex flex-col bg-stone-800 h-screen">
      <AppLayoutHeader title={props.title} nav={nav}></AppLayoutHeader>
      <main class="flex flex-row">
        <div class="flex-1">{left}</div>
        <div class="w-[1000px] bg-slate-600">{props.children}</div>
        <div class="flex-1">{right}</div>
      </main>
      <AppLayoutFooter title={props.title}></AppLayoutFooter>
    </div>
  );
};

export default AppLayout;
