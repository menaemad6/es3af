import React from 'react'

import "./LoadingSpinner.css"

const LoadingSpinner = ({width = '20px', height = '20px' , color='white'}) => {
  return (
    <span className="custom-loading-spinner" style={{ width, height , color }}></span>
  )
}

export default LoadingSpinner