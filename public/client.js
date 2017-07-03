/* global d3 */

var p1 = { x: 100, y: 100 };
var p2 = { x: 300, y: 300 };

var theta = 0;


class Linkage {
  constructor(p1, p2, theta) {
    this.p1 = p1;
    this.p2 = p2;
    this.theta = theta * Math.PI / 180;
  }
  
  get pathd() {
    const { p1, p2, c1, c2 } = this;
    return `M ${p1.x} ${p1.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${p2.x} ${p2.y}`;
  }
  get endpoints() {
    return [this.p1, this.p2];
  }
  get controlpoints() {
    return [this.c1, this.c2];
  }
  get controlhandles() {
    return [{
      p: this.p1,
      c: this.c1
    },{
      p: this.p2,
      c: this.c2
    }]
  }
  get midpoint() {
    return {
      x: (this.p1.x + this.p2.x)/2,
      y: (this.p1.y + this.p2.y)/2
    }
  }
  get axis() {
    // Don't forget svg y positive is down
    return {
      x1: this.midpoint.x - Math.cos(this.theta) * this.distance/2,
      y1: this.midpoint.y + Math.sin(this.theta) * this.distance/2,
      x2: this.midpoint.x + Math.cos(this.theta) * this.distance/2,
      y2: this.midpoint.y - Math.sin(this.theta) * this.distance/2
    }
  }
  get distance() {
    return Math.sqrt(Math.pow(this.p2.x - this.p1.x, 2) + Math.pow(this.p2.y - this.p1.y, 2));
  }
  get c1() {
    return {
      x: Math.cos(this.theta) * this.distance/2 + this.p1.x,
      y: Math.sin(this.theta) * this.distance/2 + this.p1.y
    };
  }
  get c2() {
    return {
      x: Math.cos(this.theta) * this.distance/2 + this.p2.x,
      y: Math.sin(this.theta) * this.distance/2 + this.p2.y
    };
  }
}

var dragmove = d3.drag()
  .on("drag", function(d) {
    d.x = d3.event.x;
    d.y = d3.event.y;
    render();
  });

const angleRange = document.querySelector('.angle.control [type=range]')
const angleNumber = document.querySelector('.angle.control [type=number]')


angleRange.addEventListener('input', function() {
  angleNumber.value = theta = this.value;
  render();
})

angleNumber.addEventListener('input', function() {
  theta = this.value;
  angleRange.value = theta = this.value;
  render();
})


render();

/*
<svg id="canvas">
  <circle class="endpoint" r="20" cx="100" cy="100"></circle>
  <circle class="endpoint" r="20" cx="300" cy="300"></circle>
</svg>

*/

function render() {
  
  d3.select('#canvas')
    .selectAll('.endpoint')
    .data([p1,p2])
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .call(dragmove)
  
  const link = new Linkage(p1, p2, theta)
  
  d3.select('.direct-connection')
    .attr('x1', p1.x)
    .attr('y1', p1.y)
    .attr('x2', p2.x)
    .attr('y2', p2.y)
  
  d3.selectAll(".control-point")
    .data(link.controlpoints)
    .attr('transform', d => `translate(${d.x},${d.y})`)
  
  d3.selectAll(".control-handle")
    .data(link.controlhandles)
    .attr('x1', d=>d.p.x)
    .attr('y1', d=>d.p.y)
    .attr('x2', d=>d.c.x)
    .attr('y2', d=>d.c.y)
  
  d3.select('.symmetry-axis')
    .attr('x1', link.axis.x1)
    .attr('y1', link.axis.y1)
    .attr('x2', link.axis.x2)
    .attr('y2', link.axis.y2)
  
  d3.select('.link')
    .attr('d', link.pathd)
  
  
  
}
