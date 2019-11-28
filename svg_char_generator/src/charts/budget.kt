package cz.cityvizor.svg_char_generator.charts

import com.github.nwillc.ksvg.elements.Container
import com.github.nwillc.ksvg.elements.SVG
import cz.cityvizor.svg_char_generator.pojo.Budget
import java.math.BigDecimal

data class Coordinates(val x: Int, val y: Int)

fun Container.budgetChart(
        expectation: BigDecimal,
        reality: BigDecimal,
        coordinates: Coordinates = Coordinates(25, 10),
        color: String = "#E73431"
) {
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
            fill = color
            attributes["fill-opacity"] = "0.6"
        }
        rect {
            x = positionX.toString()
            width = "10"
            y = (positionY + (chartHeight - offset)).toString()
            height = (offset).toString()
            fill = color
        }
    }
}

fun getBudgetChart(budget: Budget) = SVG.svg {
    attributes["xmlns"] = "http://www.w3.org/2000/svg"
    width = "100%"
    height = "100%"
    viewBox = "0 0 100 150"
    text {
        x = "1"
        y = "5"
        body= "Rok ${budget.year}"
        fontSize = "5px"
    }
    budgetChart(budget.budgetExpenditureAmount, budget.expenditureAmount, Coordinates(10, 10))
    budgetChart(budget.budgetIncomeAmount, budget.incomeAmount, Coordinates(30, 10), color = "#2581C4")
    text {
        x = "12"
        y = "115"
        body= "Výdaje"
        fontSize = "2px"
    }
    text {
        x = "32"
        y = "115"
        body= "Příjmy"
        fontSize = "2px"
    }
    text {
        x = "0"
        y = "120"
        body= "Rozpočet"
        fontSize = "2px"
    }
    text {
        x = "10"
        y = "120"
        body= "${budget.budgetExpenditureAmount.toInt()} Kč"
        fontSize = "2px"
    }
    text {
        x = "10"
        y = "125"
        body= "${budget.expenditureAmount.toInt()} Kč"
        fontSize = "2px"
    }
    text {
        x = "0"
        y = "125"
        body= "Čerpáno"
        fontSize = "2px"
    }

    text {
        x = "30"
        y = "120"
        body= "${budget.budgetIncomeAmount.toInt()} Kč"
        fontSize = "2px"
    }
    text {
        x = "30"
        y = "125"
        body= "${budget.incomeAmount.toInt()} Kč"
        fontSize = "2px"
    }
}
