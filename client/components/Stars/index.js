import React from 'react'
import { useEffect, useRef } from 'preact/hooks'
import logoImage from '../../assets/vetwhite.png';

import './index.sass'

const sf = {
  starDensity: window.innerWidth < 500 ? .018 : .032,
  canvas: null,
  container: null,
  dy: 0.06, // horizontal velocity
  cw: null, // canvasWidth
  ch: null, // canvasHeight
  ctx: null,  // context
  numStars: null,
  stars: [],
  layers: [],
  logo: null, // Add a property to store the logo image
}

export default function Stars() {
  const starsRef = useRef()
  const canvasRef = useRef()

  useEffect(
    () => {
      sfSetup({ starsRef, canvasRef })
      requestAnimationFrame(starfieldAnimate)

      window.addEventListener(
        'resize',
        function() {
          waitForFinalEvent(
            function(){ sfSetup({ starsRef, canvasRef }) }
            ,400
          )
        }
      )
    },
    []
  )

  return <div className="Stars" ref={starsRef}>
    <canvas className="Stars-canvas" ref={canvasRef}/>
  </div>
}

function sfSetup({ starsRef, canvasRef }){
  sf.stars = []
  sf.layers = []
  sf.canvas = canvasRef.current
  sf.container = starsRef.current
  sf.ctx = sf.canvas.getContext("2d")
  sf.cw = window.innerWidth; // Use window.innerWidth instead of container's bounding rect
  sf.ch = window.innerHeight; // Use window.innerHeight instead of container's bounding rect

  sf.canvas.width = sf.cw
  sf.canvas.height = sf.ch

  const multiplier = window.innerWidth < 500 ? 3.2 : 6
  const area = (sf.cw * sf.ch) / (multiplier * multiplier)
  sf.numStars = area * sf.starDensity

  const max = 3
  const med = 2
  const min = 1

  let starCount = 0

  while(starCount <= sf.numStars) {
    let size = rand(1, 3)
    let count

    if (size == 1) {
      size = max
      count = 1
    } else if (size == 2) {
      size = med
      count = 20
    } else {
      size = min
      count = 80
    }
    createStar(size, count)
    starCount += count
  }

  // create a panel for each star set
  for (let i = min; i <= max + 1; i++) {
    const buffer = document.createElement('canvas')
    buffer.width = sf.cw
    buffer.height = sf.ch
    const bufferContext = buffer.getContext('2d')
    renderStars(i, bufferContext)
    sf.layers.push({ y: 0, s: i, buffer })
  }

  // Create a new Image object for the logo
  sf.logo = new Image();
  sf.logo.onload = function() {
    // Logo loaded successfully
  };
  sf.logo.onerror = function() {
    console.error('Failed to load logo image:', logoImage);
  };
  sf.logo.src = logoImage;
}


function createStar(size, numberToCreate) {
  for (let i = 0; i < numberToCreate; i++) {
    const x = rand(4, sf.cw - 4)
    const y = rand(4, sf.ch - 4)

    sf.stars.push({
      x: x,
      y: y,
      s: size
    })
  }
}

function starfieldAnimate() {
  requestAnimationFrame(starfieldAnimate)
  clearCanvas()
  animatePanel()
}

function renderStars(size, bufferContext) {
  for (var i = 0; i < sf.numStars; i++) {
    const star = sf.stars[i]
    if (star.s != size) continue

    let color
    // big star color
    if (star.s == 3){
      color = `rgba(${randomColor()}, ${rand(4, 7) / 10})`
    }
    // med star color
    if (star.s == 2){
      color = `rgba(${randomColor()}, ${rand(3, 6) / 10})`
    }
    // small star color
    if (star.s == 1){
      color = `rgba(${randomColor()}, ${rand(3, 5) / 10})`
    }

    bufferContext.beginPath()
    bufferContext.fillStyle = color
    bufferContext.fillRect(star.x, star.y, star.s, star.s)
    bufferContext.closePath()
    bufferContext.fill()
  }
}

function animatePanel() {
  for (let i = 0; i < sf.layers.length; i++) {
    const layer = sf.layers[i]
    layer.x = 0
    layer.y = (layer.y * -1) >= sf.ch ? 0 : layer.y - ((layer.s * 2) * sf.dy)
    layer.y2 = layer.y + sf.ch

    sf.ctx.drawImage(layer.buffer, layer.x, layer.y)
    sf.ctx.drawImage(layer.buffer, layer.x, layer.y2)

    sf.ctx.drawImage(layer.buffer, layer.x + sf.cw, layer.y)
    sf.ctx.drawImage(layer.buffer, layer.x + sf.cw, layer.y2)
  }

  // Draw the logo
  const logoWidth = 300;
  const logoHeight = 300;
  const logoX = (sf.cw - logoWidth) / 2; // Center the logo horizontally
  const logoY = (sf.ch - logoHeight) / 2; // Center the logo vertically
  const logoOpacity = 0.1; // Adjust this value (0.0 - 1.0) to change the transparency

  sf.ctx.globalAlpha = logoOpacity;
  sf.ctx.drawImage(sf.logo, logoX, logoY, logoWidth, logoHeight);
  sf.ctx.globalAlpha = 1.0; // Reset the global alpha value
}

function clearCanvas() {
  sf.ctx.clearRect(0, 0, sf.cw, sf.ch)
}

function rand(from,to) {
  return Math.floor(Math.random() * (to - from + 1) + from)
}

let uniqueId //eslint-disable-line
const waitForFinalEvent = (function () {
  var timers = {}
  return function (callback, ms, uniqueId) {
    if (!uniqueId) {
      uniqueId = "Don't call this twice without a uniqueId"
    }
    if (timers[uniqueId]) {
      clearTimeout(timers[uniqueId])
    }
    timers[uniqueId] = setTimeout(callback, ms)
  }
})()

function randomColor(){
  const min = 170
  const max = 255 - min
  const red = min + rand(0, max)
  const green = min + rand(0, max)
  const blue = min + rand(0, max)
  return `${red},${green},${blue}`
}