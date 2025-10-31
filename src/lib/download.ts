export function downloadCanvasPNG(canvas: HTMLCanvasElement, filename = 'chart.png'){
  const url = canvas.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
}