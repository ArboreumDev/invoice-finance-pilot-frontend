export const principalToInterest = (
    principal: number, afterXCompoundPeriods=3, apr=0.01666667
    ) => {
    return Math.round(apr * afterXCompoundPeriods * principal)
}