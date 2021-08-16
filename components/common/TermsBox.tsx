import {Terms} from "../Main";
import {Box, Input} from "@chakra-ui/react";
import React, {useState} from "react";

const TermsBox = (props: {defaultApr, setNewApr, defaultTenor, setNewTenor, defaultCreditLimit,
    setNewCreditLimit}) => {
    return (
        <>
            <Box>
                <Input
                    m={2}
                    width="300px"
                    onChange={(e) => props.setNewApr(parseFloat(e.target.value))}
                    placeholder={"new apr: " + props.defaultApr}
                />
                <Input
                    m={2}
                    width="300px"
                    onChange={(e) => props.setNewCreditLimit(parseFloat(e.target.value))}
                    placeholder={"new credit line size: " + props.defaultCreditLimit }
                />
                <Input
                    m={2}
                    width="300px"
                    onChange={(e) => props.setNewTenor(parseFloat(e.target.value))}
                    placeholder={"new default tenor (in days): " + props.defaultTenor}
                />
                </Box>
            </>
    )
}

export default TermsBox