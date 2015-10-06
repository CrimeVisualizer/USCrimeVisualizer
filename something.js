  getData(function (data) {
      // data is a in JSON format
      // data contains the crimes in the timeperiod specified in params
      var coord;

      // tooltip element is invisible by default
      var tooltip = d3.select("body").append("div") 
          .attr("class", "tooltip")       
          .style("opacity", 0);
      
      // add dots to svg
      // this is where the magic happens 
      // 'glues' the dots to the map
      // d3 is smart enough to know where to put the dots based on lat and longitude
      data = JSON.parse(data);
      svg.selectAll("circle")
      .data(data).enter()
      .append("circle")
      .attr("cx", function (d) {
        coord = [d.X, d.Y];
        return projection(coord)[0]; 
      })
      .attr("cy", function (d) { 
        coord = [d.X, d.Y];
        return projection(coord)[1]; 
      })

      .attr("r", "1px") 
      .attr("stroke", "red")
      .on("mouseover", function(d) {
          // render tooltip when hovering over a crime 
          tooltip.transition()    
             .duration(200)    
             .style("opacity", .9);    
          tooltip.text(d.Category)  
             .style("left", (d3.event.pageX) + "px")   
             .style("top", (d3.event.pageY - 28) + "px");
          })          
      .on("mouseout", function(d) {   
          // make tooltip invisible when user stops hovering over dot  
          tooltip.transition()    
              .duration(500)    
              .style("opacity", 0); 
          svg.selectAll('circle')
          // .attr("r", "1px");
      });
      // displays the district name on top of the map on hover 
      $('svg path').hover(function() {
        $("#details").text($(this).data("id") + " : " + $(this).data("name"));
      });
      // uncomment the below line if you want to animate the points over time
      animatePoints();
