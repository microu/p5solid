import AppLayout from "./AppLayout";

function App() {
  const nav = <p class="my-auto pl-2">Nav, nav nav ! </p>;

  return (
    <AppLayout title="P5 /Solid (step2)" nav={nav}>
      <div class="text-blue-900 h-96">Content</div>
    </AppLayout>
  );
}

export default App;
