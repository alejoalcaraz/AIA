import { useLocation } from "react-router-dom"

export default function BrazoInteractivo() {
    const location = useLocation()
    console.log(location)
  return (
    <div>{location.state}</div>
  )
}
