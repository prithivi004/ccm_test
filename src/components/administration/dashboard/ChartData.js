import Chart from 'chart.js'

export const PieOptions = () => {
    return {
        legend: false,
        plugins: pluginsFalse,
        tooltips: tooltips,
        
    }
}
export const BarOptions = () => {
    return {
        
        plugins: pluginsTrue,
        tooltips: tooltips2,
        legend: barLegend,
        scales: scales,
        responsive:true,
        maintainAspectRatio: true,
        layout: bar_layout,
    }
}
export const BarOptions2 = () => {
    return {
        
        plugins: pluginsFalse,
        tooltips: tooltips2,
        scales: scales,
        responsive:true,
        maintainAspectRatio: true,
        
    }
}
export const SidebarOptions = () => {
    return {
        legend: {
            display: false
        },
        plugins: Sidebarplugin,
        tooltips: tooltips,
        scales: scales,
        layout: sidebar_layout,
    }
}

const tooltips = {
    titleSpacing: 6,
    xPadding: 15,
    yPadding: 15,
    titleFontSize: 12,
    bodyFontSize: 19,
    callbacks: {
        title: function (tooltipItem, data) {
            // console.log(tooltipItem,"tipitem")
            // console.log(data,"data")
            return data['labels'][tooltipItem[0]['index']];
        },
        label: function (tooltipItem, data) {
            var value=data['datasets'][0]['data'][tooltipItem['index']]
            value=value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            return value ;
        },
    },
}

const tooltips2= {
    mode: 'label',
    callbacks: {
       label: function(t, d) {
          var dstLabel = d.datasets[t.datasetIndex].label;
          var yLabel = t.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          return dstLabel + ': ' + yLabel ;
       }
    }
 }


const scales = {
    xAxes: [{
        gridLines: {
            display: false
        },
        ticks:{
            userCallback: function(value, index, values) {
                // value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                if(value > 999 && value < 1000000){
                    return (value/1000).toFixed() + 'K'; // convert to K for valueber from > 1000 < 1 million 
                }else if(value > 1000000){
                    return (value/1000000).toFixed() + 'M'; // convert to M for valueber from > 1 million 
                }else if(value < 900){
                    return value; // if value < 1000, nothing to do
                }
               
                return value;
            }
        }
    }],
    yAxes: [{
        gridLines: {
            display: false
        },
        ticks: {
            beginAtZero: true,
            fontSize: 15,
            minimum: 20,
            userCallback: function(value, index, values) {
                // value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
               
                // return value;

                if(value > 999 && value < 1000000){
                    return (value/1000).toFixed() + 'K'; // convert to K for valueber from > 1000 < 1 million 
                }else if(value > 1000000){
                    return (value/1000000).toFixed() + 'M'; // convert to M for valueber from > 1 million 
                }else if(value < 900){
                    return value; // if value < 1000, nothing to do
                }
                return value;
            }
        },
    }]
}
const pieLegend = {
    position: 'left',
    padding: 10,
    labels: {
        fontSize: 13,
        fontColor: "black",
    }
}
const barLegend = {
    position:'bottom',
    labels: {
        padding:30,
        fontSize: 15,
        boxWidth: 30,
        fontFamily: 'Times New Roman',
    }
}

const pluginsFalse = {
    datalabels: {
        display: false
    }
}
const pluginsTrue = {
    datalabels: {
        align: 'top',
        anchor: 'end',
        rotation: 270,
        formatter :  function(value,context){
            // console.log(context.chart.data.datasets[context.datasetIndex].data[context.dataIndex]);
            return context.chart.data.datasets[context.datasetIndex].data[context.dataIndex].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }
    
}
const Sidebarplugin = {
    datalabels: {
        align: 'right',
        anchor: 'end',
        formatter :  function(value,context){
            // console.log(context.chart.data.datasets[context.datasetIndex].data[context.dataIndex]);
            return context.chart.data.datasets[context.datasetIndex].data[context.dataIndex].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }
}
const sidebar_layout = {
    padding: {
        left: 0,
        right: 70,
        top: 0,
        bottom: 0
    }
}
const bar_layout = {
    padding: {
        left: 0,
        right: 0,
        top: 90,
        bottom: 0
    }
}