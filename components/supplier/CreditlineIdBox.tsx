import {Box, Input} from "@chakra-ui/react";
import React from "react";

const CreditlineIdBox = (
    props: {
        currentCreditlineId: string,
        setCreditlineID: React.Dispatch<React.SetStateAction<string>>,
    }) => {
    return (
        <>
            <Box>
                <Input
                    m={2}
                    width="300px"
                    onChange={(e) => props.setCreditlineID(e.target.value)}
                    placeholder={
                        props.currentCreditlineId ? props.currentCreditlineId : "optional: enter ID from liquiloans"
                    }
                />
                </Box>
            </>
    )
}

export default CreditlineIdBox