const height = 900;
const width = 1100;
const padding = 20;

let chart = [];
for (let i = 0; i < 13; i++) {
    chart[i] = d3.select(`#chart${i+2}`);
};

let chart1 = d3.select("#chart1");
let footer = d3.select("#footer");


const tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            ;

d3.csv("berlin_wall_deaths.csv").then(function(dataset) {

    let colors = ["#34A8F9", "#978802", "#EA8F00", "#C1738D", "#288CD2", "#B7A40A", "#C07924", "#DD8FA9", "#2D6FA3", "#615718", "#9B5E00", "#7F4B5B", "#2D5A83"];
    let causes = ["Shot", "Drowned", "Train", "Suicide", "Fall", "Injuries", "Shot-Accident", "Suffocation", "Accident", "Balloon crash", "Bludgeoned", "Pneumonia", "Unknown"]
    let names = [];
    for (let i = 0; i < dataset.length; i++) {
        names[i] = dataset[i].Names;
    };
    

    console.log(names);


    //D3 CODE------------------------------------------------------

    function tooltipEnter(d) {
        d3.select(this)
        .style("border", "1px solid #ffffff");
    
        tooltip
            .style("opacity", 1)
            .style("left", (d3.event.pageX - 100) + "px")		
            .style("top", (d3.event.pageY + 20) + "px")
            .html(d.Names)
            .html(`<h3>${d.Names}</h3>
            <p><span>born: </span>${d.dob}</p>
            <p><span>died: </span>${d.dod}</p>
            <p><span>c.o.d: </span>${d.Cause}</p>`); 
    };

    function tooltipMove(d) {
        d3.select(this)
        .style("border", "1px solid #ffffff");

        tooltip
            .style("opacity", 1)	
            .style("left", (d3.event.pageX - 100) + "px")		
            .style("top", (d3.event.pageY + 20) + "px");
    };

    function tooltipLeave(d) {
        d3.select(this).style("border", "none")
        tooltip.style("opacity", 0);
    };

    chart1.selectAll(".person")
        .data(dataset)
        .enter()
        .append("div")
        .attr("class", "person")
        .style("background-color", function(d) {
            if (causes.indexOf(d.Cause) !== -1) {
                let newIndex = causes.indexOf(d.Cause);
                return colors[newIndex];
            } else {
                return "#ffffff";
            }
        })
        .on("mouseenter", tooltipEnter)
        .on("mousemove", tooltipMove)
        .on("mouseleave", tooltipLeave);
        

        for (let i = 0; i < 13; i++) {
            chart[i].selectAll(".person")
            .data(dataset.filter(function(d) { return d.Cause == causes[i] }))
            // .data(dataset.filter(function(d) { return d.Cause == "Shot" }))
            .enter()
            .append("div")
            .attr("class", "person")
            .style("background-color", colors[i])
            .on("mouseenter", tooltipEnter)
            .on("mousemove", tooltipMove)
            .on("mouseleave", tooltipLeave);
        };

    // chart[1].selectAll(".person")
    //     .data(dataset.filter(function(d) { return d.Cause == "Shot" }))
    //     .enter()
    //     .append("div")
    //     .attr("class", "person")
    //     .style("background-color", "#34A8F9")
    //     .on("mouseenter", tooltipEnter)
    //     .on("mousemove", tooltipMove)
    //     .on("mouseleave", tooltipLeave);


    // chart[2].selectAll(".person")
    //     .data(dataset.filter(function(d) { return d.Cause == "Drowned" }))
    //     .enter()
    //     .append("div")
    //     .attr("class", "person")
    //     .style("background-color", "#978802")
    //     .on("mouseenter", tooltipEnter)
    //     .on("mousemove", tooltipMove)
    //     .on("mouseleave", tooltipLeave);

    // chart[3].selectAll(".person")
    //     .data(dataset.filter(function(d) { return d.Cause == "Train" }))
    //     .enter()
    //     .append("div")
    //     .attr("class", "person")
    //     .style("background-color", "#EA8F00")
    //     .on("mouseenter", tooltipEnter)
    //     .on("mousemove", tooltipMove)
    //     .on("mouseleave", tooltipLeave);

    // chart[4].selectAll(".person")
    //     .data(dataset.filter(function(d) { return d.Cause == "Suicide" }))
    //     .enter()
    //     .append("div")
    //     .attr("class", "person")
    //     .style("background-color", "#C1738D")
    //     .on("mouseenter", tooltipEnter)
    //     .on("mousemove", tooltipMove)
    //     .on("mouseleave", tooltipLeave);

    // chart[5].selectAll(".person")
    //     .data(dataset.filter(function(d) { return d.Cause == "Fall" }))
    //     .enter()
    //     .append("div")
    //     .attr("class", "person")
    //     .style("background-color", "#288CD2")
    //     .on("mouseenter", tooltipEnter)
    //     .on("mousemove", tooltipMove)
    //     .on("mouseleave", tooltipLeave);

    // chart[6].selectAll(".person")
    //     .data(dataset.filter(function(d) { return d.Cause == "Injuries" }))
    //     .enter()
    //     .append("div")
    //     .attr("class", "person")
    //     .style("background-color", "#B7A40A")
    //     .on("mouseenter", tooltipEnter)
    //     .on("mousemove", tooltipMove)
    //     .on("mouseleave", tooltipLeave);

});
