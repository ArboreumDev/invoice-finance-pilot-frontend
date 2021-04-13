import React from "react"
import { Doughnut } from "react-chartjs-2"

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// export const color1 = "teal.500"
// export const color2 = "teal.800"
// export const color3 = "gray.500"

// BG colors
export const color1 = "#009688"
export const color2 = "#4CAF50"
// export const color2 = "#009C8A"
export const color3 = "#9E9E9E"

// hover bg colors
const hover1 = "#80CBC4"
const hover2 = "#A5D6A7"
const hover3 = "#BDBDBD"

const getBGColors  = (amounts) => {
  const requestedColors = Array((amounts.length -1) / 2).fill(color1)
  const usedColors = Array((amounts.length -1) / 2).fill(color2)
  let bgColors = requestedColors.concat(usedColors)
  bgColors.push(color3)
  return bgColors
}

const getHoverBGColors  = (amounts) => {
  const requestedColors = Array((amounts.length -1) / 2).fill(hover1)
  const usedColors = Array((amounts.length -1) / 2).fill(hover2)
  let bgColors = requestedColors.concat(usedColors)
  bgColors.push(hover3)
  return bgColors
}


export default function DynamicDoughnut({ amounts, labels }: any) {
 // console.log(bgColors)
  // console.log(amounts)
  // const requestedColors = Array((amounts.length -1) / 2).fill(color1)
  const state = {
    labels: labels, //["Invested", "Pledged", "Uninvested"],
    datasets: [
      {
        data: amounts,
        backgroundColor: getBGColors(amounts),
        // backgroundColor: ["#009C8A", "#a3b1c0", "#71BF45"],
        hoverBackgroundColor: getHoverBGColors(amounts) 
      },
    ],
  }
  return (
    <Doughnut
      options={{ legend: false }}
      data={state}
      width={360}
      height={360}
    />
  )
}
