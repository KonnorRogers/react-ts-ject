import * as React from "react"
import { Button, SearchBox } from "./harmony"

export function App() {
  const [count, setCount] = React.useState(0)

  return (
    <>
      <Button onClick={() => setCount(count + 1)}>
        {count}
      </Button>
      <br />
      <SearchBox data-testid="searchbox" role="searchbox" />
      <input data-testid="search" type="search" />
    </>
  );
}
