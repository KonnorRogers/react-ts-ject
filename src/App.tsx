import * as React from "react"
import { Button } from "./harmony"

export function App() {
  const [count, setCount] = React.useState(0)

  return (
    <Button onClick={() => setCount(count + 1)}>
      {count}
    </Button>
  );
}
