import React, { useState, useEffect, useRef, useCallback } from 'react'

import useReachBottom from 'react-use-reach-bottom'

function getRandomList(num = 20) {
  return new Array(num).fill(0)
}

export default function App() {
  const [ list, setList ] = useState([])
  const [ loading, setLoading ] = useState(false)
  const [ useWindow, setUseWindow ] = useState(true)
  const containerRef = useRef()

  useEffect(() => {
    setList(getRandomList(20))
  }, [])

  const value = useReachBottom(distance => {
    if (distance >= 0.95 && !loading) {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setList(list.concat(getRandomList(50)))
      }, 1500)
    }
  }, {
    element: useWindow ? window : containerRef,
    throttleDelay: 200
  })

  const toggleUseWindow = useCallback(() => setUseWindow(!useWindow))

  return (
    <div className={useWindow ? 'container' : 'container limit-height'} ref={containerRef}>

      <div className="value">{ value.toFixed(2) }</div>
      <div className="toggle-btn" onClick={toggleUseWindow}>
        <input type="checkbox" defaultChecked={useWindow} />
        <span>window</span>
      </div>

      <div className="content">
        {list.map((_, index) => <section className="block" key={index}>{ index }</section>)}
        {loading && <div className="loading">Loading...</div>}
      </div>
    </div>
  )
}
