export function renderPlot(data){
    const plot = document.getElementById('plot-content-id');
    plot.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;" + data.plot.split("—")[0] + "<span style='font-weight : 500 ; opacity : 0.3 ; font-style : italic'> &nbsp;&nbsp;&nbsp;&nbsp;~" + data.plot.split("—")[1] + "</span>"
}