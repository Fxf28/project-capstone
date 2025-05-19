import React from "react";
import { getData } from "@/actions/action";
import Todos from "@/components/todos";

export default async function page() {
  const data = await getData();
  return (
    <div>
      <Todos todos={data} />
    </div>
  );
}
