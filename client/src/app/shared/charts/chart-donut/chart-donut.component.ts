import { Component, Input } from "@angular/core";
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from "@angular/animations";

@Component({
  moduleId: module.id,
  selector: "chart-donut",
  templateUrl: "chart-donut.component.html",
  animations: [
    trigger("showAnimation", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate("500ms", style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class ChartDonutComponent {
  @Input() data: any;

  constructor() {}

  // generate SVG path attribute string for a donut stripe; start and size are percentage of whole, i.e. 1 is full circle
  generateStripePath(x, y, innerRadius, outerRadius, start, size) {
    if (size >= 0.999) size = 0.999; // if a stripe would be 100%, then it's circle, this is a hack to do it using this function instead of another

    innerRadius = Math.max(innerRadius, 0); // inner size must be greater than 0
    outerRadius = Math.max(outerRadius, innerRadius); // outer size must be greater than inner
    size = Math.max(size, 0);
    if (size == 0 || size == 1) start = 0; // if a stripe is 0% or 100%, means it has to start at 0 angle

    var startAngle = 2 * Math.PI * start;
    var angle = 2 * Math.PI * size;

    var startX1 = x + Math.sin(startAngle) * outerRadius;
    var startY1 = y - Math.cos(startAngle) * outerRadius;
    var endX1 = x + Math.sin(startAngle + angle) * outerRadius;
    var endY1 = y - Math.cos(startAngle + angle) * outerRadius;

    var startX2 = x + Math.sin(startAngle + angle) * innerRadius;
    var startY2 = y - Math.cos(startAngle + angle) * innerRadius;
    var endX2 = x + Math.sin(startAngle) * innerRadius;
    var endY2 = y - Math.cos(startAngle) * innerRadius;

    var outerArc = size > 0.5 ? 1 : 0; // decides which way will the arc go

    var properties: string[] = [];
    properties.push("M" + startX1 + "," + startY1);
    properties.push(
      "A" +
        outerRadius +
        "," +
        outerRadius +
        " 0 " +
        outerArc +
        ",1 " +
        endX1 +
        "," +
        endY1
    );
    properties.push("L" + startX2 + "," + startY2);
    properties.push(
      "A" +
        innerRadius +
        "," +
        innerRadius +
        " 0 " +
        outerArc +
        ",0 " +
        endX2 +
        "," +
        endY2
    );
    properties.push("Z");

    return properties.join(" ");
  }
}
