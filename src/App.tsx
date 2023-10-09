import * as React from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Fragrant from './Fragrant'

function App() {
  const [isStart, setIsStart] = React.useState<boolean>(false);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <Fragrant
        start={isStart}
        path='m177,254l0,-143c0,0 0,-34 -32,-32'
        width={350}
        height={300}
        pathWidth={12}
        fgColor='#000000'
        bgColor='#e9e9e9'
        time={30_000}
        bgDuration={3_000}
      />
      <br />
      <button onClick={() => setIsStart(!isStart)}>{isStart ? '暂停' : '开始'}</button>
    </>
  )
}

export default App
