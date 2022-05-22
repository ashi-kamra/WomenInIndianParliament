people();

function people() {
    //importing data
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", 700)
        .attr("height", 700);


    d3.json("IndianParliamentData.json").then(function(data) {
        console.log(data)

        var people = [];

        for (let i = 0; i < Object.keys(data["Age"]).length; i++) {
            let person = {};
            person.name = data["Name of Member"][i];
            person.age = data["Age"][i];
            person.party = data["Party Name"][i];
            person.constituency = data["Constituency"][i];
            person.state = data["State"][i];
            person.firstTime = data["UT"][i];
            person.category = data["Category"][i];
            person.gender = data["Woman"][i];
            people.push(person);
        }


        //console.log(people);

        var width = 700
        var height = 700

        //making the people
        var node = svg.append("g")
            .selectAll("circle")
            .data(people)
            .enter()
            .append("circle")
            .attr("fill", function(d) {
                if (d.gender == 1) {
                    return "pink"
                } else {
                    return "blue"
                }
            })
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .attr("r", 7)
            .style("fill-opacity", 0.6)
            .attr("stroke", function(d) {
                if (d.gender == 1) {
                    return "pink"
                } else {
                    return "blue"
                }
            })
            .style("stroke-width", 3)
            //hover functionality
            .on('mouseenter', function(event, d) {
                d3.select(this).attr("fill-opacity", 0)
                d3.select(this).attr("fill", "black")
                d3.select(this).attr("stroke", "black")

                //adding the info on side
                d3.select("#memberName").html(d.name);
                d3.select("#memberParty").html(d.party);
                d3.select("#memberAge").html(d.age);

                //NEED TO FIGURE OUT HOW TO GET GENDER TO NOT BE 1 or 0.
                d3.select("#memberGender").html(d.gender == 0 ? "Male" : "Female");


                d3.select("#memberState").html(d.state);

            }) //make lighter when mouse on
            .on('mouseleave', function(d, i) {
                //changing the stroke and the fill back to pink or blue
                d3.select(this).attr("stroke", function(d) {
                    if (d.gender == 1) {
                        return "pink"
                    } else {
                        return "blue"
                    }
                })
                d3.select(this).attr("fill", function(d) {
                    if (d.gender == 1) {
                        return "pink"
                    } else {
                        return "blue"
                    }
                })

            }) //make darker when mouse off

        //circle packing!
        var simulation = d3.forceSimulation()
            .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
            .force("charge", d3.forceManyBody().strength(0.5)) // Nodes are attracted one each other of value is > 0
            .force("collide", d3.forceCollide().strength(.01).radius(27).iterations(1)) // Force that avoids circle overlapping

        simulation
            .nodes(people)
            .on("tick", function(d) {
                node
                    .attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; })
            });

    });



    //organizing data into a more readable array
}