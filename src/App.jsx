import * as d3 from "d3";
import React, { useState, useEffect } from "react";

function Chart(props) {
    const { data } = props

    const leftMargin = 100
    const rightMargin = 150
    const bottomMargin = 100
    const contentWidth = 500
    const contentHeight = 500;

    const xScale = d3.scaleLinear()
        .domain([d3.min(data, (item) => item.sepalLength), d3.max(data, (item) => item.sepalLength)])
        .range([0, contentWidth])
        .nice()
    const yScale = d3.scaleLinear()
        .domain([d3.min(data, (item) => item.sepalWidth), d3.max(data, (item) => item.sepalWidth)])
        .range([contentHeight, 0])
        .nice()

    const speciesData = Array.from(new Set(data.map(({ species }) => species)))
        .map((species) => {
            return {
                id: species,
                data: data
                    .filter((item) => item.species === species)
                    .map(({ sepalLength: x, sepalWidth: y }) => ({ x, y }))
            };
        });
    const svgWidth = leftMargin + contentWidth + rightMargin
    const svgHeight = contentHeight + bottomMargin
    const color = d3.scaleOrdinal(d3.schemeCategory10)
    return <svg width={svgWidth} height={svgHeight}>
        <g transform={`translate(${leftMargin},30)`}>
            {
                xScale.ticks().map((x) => {

                    return <g transform={`translate(${xScale(x)},0)`}>
                        <line x1='0' y1={contentHeight - 5} x2='0' y2={contentHeight} stroke="black" />
                        <text y={contentHeight + 20} textAnchor='middle'>{x}</text>
                    </g>
                })
            }
            {
                yScale.ticks().map((y) => {

                    return <g transform={`translate(-20,${yScale(y)})`}>
                        <line x1='15' y1="-5" x2='20' y2="-5" stroke="black" />
                        <text x="-15" textAnchor='middle'>{y}</text>
                    </g>
                })
            }

            {
                speciesData.map((species) => {
                    return species.data.map((item, i) => {
                        return <g key={i}>
                            <circle cx={xScale(item.x)} cy={yScale(item.y)} r='5' fill={color(species.id)} />
                        </g>
                    })




                })
            }
            {
                speciesData.map(({ id }, i) => {
                    return < g key={i} transform={`translate(0,${20 + (20 * i)})`}>
                        <rect x={contentWidth + 10} y={20 * i} width={20} height={20} fill={color(id)} />
                        <text x={contentWidth + (20 * 2)} y={20 * (i + 1) - 5} textAnchor="start">{id}</text>
                    </g>;

                })

            }
            <line x1='0' y1={contentHeight - 5} x2={contentWidth} y2={contentHeight - 5} stroke='black' opacity="0.5" />
            <line x1='0' y1='-5' x2='0' y2={contentHeight} stroke='black' opacity="0.5" />
            <g transform="rotate(-90)scale(1.3)"><text x={-contentHeight / 2 + 60} y='-50' textAnchor="middle">SepalWidth</text></g>
            <g transform="scale(1.3)"><text x={contentWidth / 2 - 50} y={contentHeight - 80} textAnchor="middle">SepalLength</text></g>
        </g>
    </svg>
}




function App() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch("https://s3-us-west-2.amazonaws.com/s.cdpn.io/2004014/iris.json")
            .then((response) => response.json())
            .then((result) => setData(result))
            .catch(() => alert("error"));
    }, []);

    return data ? <Chart data={data} /> : "";
}







export default App;