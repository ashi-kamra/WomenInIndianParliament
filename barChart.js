barChart();

function barChart() {

    // create and append svg
    let margin = { top: 80, right: 80, bottom: 300, left: 80 },
        width = window.innerWidth - margin.left - margin.right,
        height = window.innerHeight - margin.top - margin.bottom;

    let svg = d3.select("#chart2").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

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

        var parties = [];

        for (let i = 0; i < people.length; i++) {
            let party = people[i].party; //using the people array to get the party of each person
            let gender = people[i].gender;

            let partyInParties = parties.filter((d) => d.name == party); //if the party for that person already exists within the array

            if (partyInParties.length == 0) {
                let obj = { name: party, count: 1, numWomen: gender == 0 ? 1 : 0 };
                parties.push(obj)

            } else {
                partyInParties[0].count++;
                if (gender == 1)
                    partyInParties[0].numWomen++;
            }
        }

        console.log(parties);



        // set the x / y output ranges
        let x = d3.scaleBand()
            .range([0, width / 1.5])
            .padding(0.1);
        let y = d3.scaleLinear()
            .range([height, 0]);

        // set the x / y input domains
        x.domain(parties.map(party => party.name));
        y.domain([0, d3.max(parties, party => +party.count)]);

        let colors = d3.scaleLinear()
            .domain([0, parties.length * .33, parties.length * .66, parties.length])
            .range(['#ffff00', '#ff0000', '#ff00ff', '#0000ff'])

        svg.selectAll()
            .data(parties)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.name))
            .attr("width", 15) //x.bandwidth())
            .attr("y", d => y(d.count)) //how to get the number of people in each party
            .attr("height", d => height - y(d.count))
            .attr("fill", function(d, i) { return colors(i) })

        // svg.append("g")
        //     .attr("class", "x axis")

        //     .attr("transform", "translate(0," + height + ")")
        //     .call(d3.axisBottom(x));

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            // .style("text-anchor", "end")
            // .attr("dx", "-.8em")
            // .attr("dy", ".15em")
            // .attr("transform", "rotate(-65)");
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(60)")
            .style("text-anchor", "start");


        svg.append("text")
            .attr("transform",
                "translate(" + (width / 3) + " ," +
                (height + margin.top + 100) + ")")
            .style("text-anchor", "middle")
            .text("Political Party");

        // add the y Axis
        svg.append("g")
            .call(d3.axisLeft(y));

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 3))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Number of People");

    })


}