import { useLocation } from "react-router-dom"

// Este ambiente está en desarrollo.
export default function BrazoInteractivo() {
    const location = useLocation()
    console.log(location)
  return (
    <div>{location.state}</div>
  )
}
