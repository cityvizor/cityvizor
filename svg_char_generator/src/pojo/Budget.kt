package cz.cityvizor.svg_char_generator.pojo

import java.math.BigDecimal

data class Etl(val _id: String, val vality: String)

data class Budget(val _id: String, val year: Int, val etl: Etl, val budgetExpenditureAmount: BigDecimal, val expenditureAmount: BigDecimal, val budgetIncomeAmount: BigDecimal, val incomeAmount: BigDecimal)