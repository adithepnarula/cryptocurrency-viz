
// function searchNode() {
//     //find the node
//     var selectedVal = document.getElementById('search').value;
//     var node = svg.selectAll(".node");
//     if (selectedVal == "none") {
//         node.style("stroke", "white").style("stroke-width", "1");
//     } else {
//         var selected = node.filter(function (d, i) {
//             return d.name != selectedVal;
//         });
//         selected.style("opacity", "0");
//         var link = svg.selectAll(".link")
//         link.style("opacity", "0");
//         d3.selectAll(".node, .link").transition()
//             .duration(5000)
//             .style("opacity", 1);
//     }
// }
//idea
