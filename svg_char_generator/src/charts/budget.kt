package cz.cityvizor.svg_char_generator.charts

import com.github.nwillc.ksvg.elements.Container
import java.math.BigDecimal
data class Coordinates(val x: Int, val y: Int)

fun Container.budgetChart(expectation: BigDecimal, reality: BigDecimal, coordinates: Coordinates = Coordinates(25, 10)) {
    val chartHeight = BigDecimal(100.0)
    val positionX = BigDecimal(coordinates.x)
    val positionY = BigDecimal(coordinates.y)

    val offset = (reality / expectation) * chartHeight
    g {
        rect {
            x = positionX.toString()
            width = "10"
            y = positionY.toString()
            height = chartHeight.toString()
            fill = "#ff9491"
        }
        rect {
            x = positionX.toString()
            width = "10"
            y = (positionY + (chartHeight - offset)).toString()
            height = (offset).toString()
            fill = "#E73431"
        }
    }
}
