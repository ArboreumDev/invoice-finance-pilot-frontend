import React from "react"
import { Doughnut } from "react-chartjs-2"

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default function DynamicDoughnut({ amounts, labels }: any) {
  const state = {
    labels: labels, //["Invested", "Pledged", "Uninvested"],
    datasets: [
      {
        data: amounts,
        backgroundColor: ["#009C8A", "#a3b1c0", "#71BF45"],
        hoverBackgroundColor: ["#009C8A", "#a3b1c0", "#71BF45"],
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
