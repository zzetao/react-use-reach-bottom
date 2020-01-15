import React, { useState, useEffect, useRef } from 'react'

import useReachBottom from 'react-use-reach-bottom'

function getRandomList(num = 20) {
  return new Array(num).fill(0)
}

export default function App() {
  const [ list, setList ] = useState([])
  const [ loading, setLoading ] = useState(false)
  const containerRef = useRef()

  useEffect(() => {
    setList(getRandomList(20))
  }, [])

  const value = useReachBottom(percentum => {
    if (percentum >= 0.95 && !loading) {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setList(list.concat(getRandomList(50)))
      }, 2000)
    }
  })

  return (
    <div className="container" ref={containerRef}>
      <div className="value">{ value.toFixed(2) }</div>
      <div className="content">
        {list.map((_, index) => <section className="block" key={index}>{ index }</section>)}
        {loading && <div className="loading">Loading...</div>}
      </div>
    </div>
  )
}
