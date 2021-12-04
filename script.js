const height = 900;
const width = 1100;
const padding = 20;

//creates a list of the chart divs to which I add the boxes later
let chart = [];
for (let i = 0; i < 13; i++) {
    chart[i] = d3.select(`#chart${i+2}`);
};

//sets up the first (unfiltered) chart and the footer
let chart1 = d3.select("#chart1");
let footer = d3.select("#footer");

//creates the tooltip to which I will add text later
const tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            ;

//reads in my dataset
d3.csv("berlin_wall_deaths.csv").then(function(dataset) {

    //sets up two lists that I will use to assign colors to specific causes of death
    let colors = ["#34A8F9", "#978802", "#EA8F00", "#C1738D", "#288CD2", "#B7A40A", "#C07924", "#DD8FA9", "#2D6FA3", "#615718", "#9B5E00", "#7F4B5B", "#2D5A83"];
    let causes = ["Shot", "Drowned", "Train", "Suicide", "Fall", "Injuries", "Shot-Accident", "Suffocation", "Accident", "Balloon crash", "Bludgeoned", "Pneumonia", "Unknown"]
    
    //sets up a list of names (I have plans to potentially add a list to the footer)
    let names = [];
    for (let i = 0; i < dataset.length; i++) {
        names[i] = dataset[i].Names;
    };

    //D3 CODE------------------------------------------------------

    //funtions for when the user's mouse hovers into, within, and out of a box
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

    //adds the first (unfiltered) chart
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
        .on("mouseleave", tooltipLeave)
        .on("touchstart", tooltipEnter)
        .on("touchmove", tooltipMove)
        .on("touchend", tooltipLeave)
        ;
        
        //this loops adds the rest of the charts (filtered by cause of death)
        for (let i = 0; i < 13; i++) {
            chart[i].selectAll(".person")
            .data(dataset.filter(function(d) { return d.Cause == causes[i] }))
            .enter()
            .append("div")
            .attr("class", "person")
            .style("background-color", colors[i])
            .on("mouseenter", tooltipEnter)
            .on("mousemove", tooltipMove)
            .on("mouseleave", tooltipLeave)
            .on("touchstart", tooltipEnter)
            .on("touchmove", tooltipMove)
            .on("touchend", tooltipLeave)
            ;
        };
});
