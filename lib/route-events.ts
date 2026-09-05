"use client"

export interface RouteFocusDetail {
  origem: string
  destino: string
  userCoords?: [number, number] | null
  targetStopId?: string
}

const EVENT_NAME = "vou-de-van:focus-closest-stop"

export function dispatchFocusClosestStop(detail: RouteFocusDetail) {
  if (typeof window === "undefined") return

  // Dispara evento customizado
  const event = new CustomEvent<RouteFocusDetail>(EVENT_NAME, { detail })
  window.dispatchEvent(event)

  // Rola suavemente para a seção do mapa (#explorar-regiao)
  const mapElement = document.getElementById("explorar-regiao")
  if (mapElement) {
    const offset = 80
    const elementPosition = mapElement.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    })
  }
}

export function subscribeFocusClosestStop(callback: (detail: RouteFocusDetail) => void): () => void {
  if (typeof window === "undefined") return () => {}

  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<RouteFocusDetail>
    if (customEvent.detail) {
      callback(customEvent.detail)
    }
  }

  window.addEventListener(EVENT_NAME, handler)
  return () => window.removeEventListener(EVENT_NAME, handler)
}
