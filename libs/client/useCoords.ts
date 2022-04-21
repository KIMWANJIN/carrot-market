// This file a hook (hook is like an useState) : it is a react component and it returns a function and a state which has a url parameter as a prop
// A function will fetch and POST data to server and than database will be mutated
// A state will be object of loading state, data and error

import { useEffect, useState } from "react"

interface Coords {
  lat: number | null
  lng: number | null
}

export default function useCoords(): Coords {
  const [coords, setCoords] = useState<Coords>({ lat: null, lng: null })
  const onSeccess = ({ coords: { latitude, longitude } }: GeolocationPosition) => {
    setCoords({ lat: latitude, lng: longitude })
  }
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(onSeccess)
  }, [])

  return coords
}
