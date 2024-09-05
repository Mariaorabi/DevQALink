import React from 'react'

const Spinner = (props) => {
  return (


    
    <div style={{display :"flex",flexDirection : "row", justifyContent : "center",alignItems : "center"}}>


{props.isLoading &&

      <div className="loading-spinner">

      </div>
}
        </div>
  )
}

export default Spinner
