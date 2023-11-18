import { Component } from "solid-js";

type TProps = {
  title: string;
};

const Header: Component<TProps> = (props) => {
  return <h1 class="text-center p-0.5font-bold text-lg text-stone-100 bg-rose-900">{props.title}</h1>;
};

export default Header;
