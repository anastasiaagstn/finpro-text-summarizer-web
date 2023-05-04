import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <h1>Base React Project</h1>
      <h2>Extractive Text Summarizer</h2>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </div>
  )
}

export default App;