import AppLayout from "./AppLayout";

function AppTestLayout() {
  const nav = <p class="my-auto pl-2 text-2xl">Nav test-layout</p>;

  return (
    <AppLayout title="P5 / Solid - Test Layout" nav={nav}>
      <div class="m-2 rounded-lg p-2 text-3xl font-bold bg-orange-200 text-blue-900 h-96">Content Content</div>
    </AppLayout>
  );
}

export default AppTestLayout;
