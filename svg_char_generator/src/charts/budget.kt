package cz.cityvizor.svg_char_generator.charts

import com.github.nwillc.ksvg.elements.Container
import com.github.nwillc.ksvg.elements.G
import com.github.nwillc.ksvg.elements.SVG
import java.math.BigDecimal
data class Coordinates(val x: Int, val y: Int)

fun Container.budgetChart(expectation: Double, reality: Double, coordinates: Coordinates = Coordinates(25, 10)) {
    val chartHeight = 100
    val positionX = coordinates.x
    val positionY = coordinates.y

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
