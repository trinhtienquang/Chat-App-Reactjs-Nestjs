import React, { useState } from 'react'

export default function MessageInput({ send } : { send: (val:string)=> void }) {
    const [value, setValue] = useState("")
  return (
    <div>
        <input onChange={(e)=> setValue(e.target.value)} placeholder='nhap tin nhan' value={value} />
        <button onClick={()=>send(value)}>Gửi</button>
    </div>
  )
}
