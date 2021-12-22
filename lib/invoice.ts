import { FinanceStatus, Invoice } from "../components/Main"

/**
 * compounding interest
 * @param principal 
 * @param afterXCompoundPeriods 
 * @param apr 
 * @param round 
 * @returns 
 */
export const principalToInterest = (
    principal: number, afterXCompoundPeriods=3, apr=0.1666667, round=true
    ) => {
        // console.log('got', principal, afterXCompoundPeriods, apr)
        if (round) return Math.round((principal * (1 + apr / 360) ** afterXCompoundPeriods) - principal)
        return (principal * (1 + apr / 360) ** afterXCompoundPeriods) - principal
}


/**
 * uncompounded 30 day interest
 * @param principal 
 * @param apr 
 * @param round 
 * @returns 
 */
export const principalToPrepaidInterest = (
    principal: number, apr=0.1666667, round=true
    ) => {
    const prepaid = principal * (apr / 12) 
    return round ? Math.round(prepaid) : prepaid
}

/**
 * accrued interest, at least the compounding one
 * @param principal 
 * @param apr 
 * @param round 
 * @returns 
 */
export const principalToAccruedInterest = (
    principal: number, afterXCompoundPeriods: number, apr: number, round=true
    ) => {
    const accrued =  Math.max(
        // 0, 
        principalToPrepaidInterest(principal, apr, false),
        principalToInterest(principal, afterXCompoundPeriods, apr, false) - principalToPrepaidInterest(principal, apr, false)
    )
    return round ? Math.round(accrued) : accrued
}

export const get_elapsed_compounding_periods = ( start_date, current_date = 0) => {
    // To set two dates to two variables
    const date1 = new Date(start_date);
    const date2 = new Date(current_date || Date.now())
        
    // To calculate the time difference of two dates
    const Difference_In_Time = date2.getTime() - date1.getTime();
        
    // To calculate the no. of days between two dates
    const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Difference_In_Days
}

export const invoiceToAccruedInterest = (i: Invoice) => {
    if (!i.financedOn) return 0 
    if (i.status !== FinanceStatus.FINANCED) return 0 
    const elapsed_time = get_elapsed_compounding_periods(i.financedOn)
    return principalToAccruedInterest(i.paymentDetails.principal, elapsed_time, i.paymentDetails.apr)
}