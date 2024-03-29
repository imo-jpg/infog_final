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
        .attr("class", "tooltip");

//formats the dates in the CSV for easy reading
let dateFormat = d3.timeParse("%x");
let justYear = d3.timeFormat("%Y");

//reads in my dataset
d3.csv("berlin_wall_deaths.csv").then(function(dataset) {

    //adjusts the values in the dataset so they're more usable
    dataset.forEach(function(d) {
        d.Age = parseFloat(d.Age);
        d.year = d.dod;
        d.year = justYear(dateFormat(d.year));
    });
    
    //sets up the nested ages for building the histogram
    let ageNest = d3
        .groups(dataset, (d) => d.Age);

    let bin = d3.bin().thresholds(15).value(d => d.Age);
    let ageBins = bin(dataset);
    
    //this addes the groups for each age bucket to the page
    let ageHistogram = d3.select("#age");

    let ageGroup = ageHistogram
        .selectAll(".group")
        .data(ageBins)
        .enter()
        .append("div")
        .attr("class", "group");

    //this adds the age legends to the age histogram
    ageGroup.append('text').text(d => `${d.x0}-${d.x1}`)
        .style("width", "32px")
        .style("font-family", "IBM Plex Mono")
        .style("font-size", "8px")
        .style("text-align", "right")
        .style("padding-right", "5px");
    
    //this appends the right number of boxes to the ages histogram
    for (let i = 0; i < ageBins.length; i++) {
        ageGroup
            .selectAll(".personAge")
            .data((d) => d)
            .enter()
            .append('div')
            .style("background-color", "#666666")
            .attr("class", "personAge");
    };
    
    //sets up the nested years for building the year bar chart
    let yearNest = d3
        .groups(dataset, (d) => d.year);

    let newYears = [];

     for (let i = 0; i < yearNest.length; i++) {
        if (i != 0) {
            if (yearNest[i][0] - yearNest[i-1][0] == 1) {
            } else {
                newYears.push([`${parseFloat(yearNest[i][0]) - 1}`, []]);
            }
        }
    };
    let allYears = yearNest.concat(newYears);
    allYears.sort((a,b) => d3.ascending(parseFloat(a[0]), parseFloat(b[0])));

    //this sets up the year histogram with the right number of groups
    let yearHistogram = d3.select("#year");

    let yearGroup = yearHistogram
        .selectAll(".group")
        .data(allYears)
        .enter()
        .append("div")
        .attr("class", "group");

    //this appends the right number of boxes to the years histogram
    for (let i = 0; i < allYears.length; i++) {
        yearGroup
        .selectAll(".personYear")
        .data(d => d[1])
        .enter()
        .append('div')
        .style("background-color", "#666666")
        .style("border", "1px solid #666666")
        .attr("class", "personYear");
    }

    //this adds the age legends to the year histogram
    yearGroup.append('text').text(d => d[0])
        .style("font-family", "IBM Plex Mono")
        .style("font-size", "8px")
        .style("text-align", "center");

    //sets up two lists that I will use to assign colors to specific causes of death
    let colors = ["#34A8F9", "#978802", "#EA8F00", "#C1738D", "#288CD2", "#B7A40A", "#C07924", "#DD8FA9", "#2D6FA3", "#615718", "#9B5E00", "#7F4B5B", "#2D5A83"];
    let causes = ["Shot", "Drowned", "Train", "Suicide", "Fall", "Injuries", "Shot-Accident", "Suffocation", "Accident", "Balloon crash", "Bludgeoned", "Pneumonia", "Unknown"]
    
    //adds the list of names to the edges of the page (this shouldn't really be called "footer", sorry)
    for (let i = 0; i < dataset.length; i++) {
        footer.append("p").html(dataset[i].Names)
        .style("color", "#666666")
        .attr("class", function(d) {
                if (causes.indexOf(dataset[i].Cause) !== -1) {
                    let newIndex = causes.indexOf(dataset[i].Cause);
                    return colors[newIndex];
                } else {
                    return "#666666";
                }
        });
    }

    //sets up an event listener and a function so the names change color when you scroll past a certain point
    window.onscroll = function() {changeColor()};

    function changeColor() {

      if (document.body.scrollTop > 1600 || document.documentElement.scrollTop > 1600) {
            footer.selectAll("p")
                .style("transition", "color 1s")
                .style("color", function() {
                    return this.className;
                });
      } else {
        footer.selectAll("p").style("color", "#666666");
      }
    }

    //funtions for when the user's mouse hovers into, within, and out of a box
    function tooltipEnter(d) {
        d3.select(this)
        .style("border", "1px solid #ffffff");
    
        tooltip
            .style("opacity", 1)
            .style("left", (d3.event.pageX - 100) + "px")		
            .style("top", (d3.event.pageY + 20) + "px")
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
        .on("touchend", tooltipLeave);
        
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
        .on("touchend", tooltipLeave);
    };

});
