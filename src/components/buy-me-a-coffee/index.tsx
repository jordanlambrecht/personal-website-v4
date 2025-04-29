'use client'

import { useEffect } from 'react'

export const BuyMeACoffeeWidget = () => {
  useEffect(() => {
    const script = document.createElement('script')
    script.setAttribute('data-name', 'BMC-Widget')
    script.setAttribute('data-cfasync', 'false')
    script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js'
    script.setAttribute('data-id', 'jordyjordy')
    script.setAttribute('data-description', 'Support me on Buy me a coffee!')
    script.setAttribute(
      'data-message',
      "If you dig this model, I'd sure appreciate it if you could kick me over a $1 so I can buy my partner the occasional bottle of wine for having to put up with my chaotic and messy hobbies."
    )
    script.setAttribute('data-color', '#FF813F')
    script.setAttribute('data-position', 'Right')
    script.setAttribute('data-x_margin', '18')
    script.setAttribute('data-y_margin', '18')

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return null
}
