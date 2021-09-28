export const principalToInterest = (
    principal: number, afterXCompoundPeriods=3, apr=0.1666667
    ) => {
    return Math.round((principal * (1 + apr / 360) ** afterXCompoundPeriods) - principal)
}