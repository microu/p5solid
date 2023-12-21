import { Component } from "solid-js";

type TProps = {
  title: string;
};

const AppLayoutFooter: Component<TProps> = (props) => {
  return (
    <div class="flex h-12  bg-stone-300  text-red-900 px-2">
        <p class="my-auto text-lg">{props.title}</p>
    </div>
  );
};

export default AppLayoutFooter;
