import {
    Box,
    Input,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure
} from "@chakra-ui/react"
import { CreditLineInfo} from "./CreditlinesTable"
import React, { useState } from "react";

interface Props {
    supplier: string
}


export const AddWhitelistModal = ({supplier}: Props) => {
    return (
      <>
        <Button colorScheme="teal" >Add Whitelist Entry</Button>
    </>
    )
}

export const ModWhitelistModal = (props: {entry: CreditLineInfo, supplier: string}) => {
    const [newApr, setNewApr] = useState(null)
    const [newCreditLimit, setNewCreditLimit] = useState(null)
    const [newTenor, setNewTenor] = useState(null)
    const { isOpen, onOpen, onClose } = useDisclosure()


    const update = () => {
        // TODO use newAPR &... to hit update api
        console.log("TODO hit /update api") 
    }

    return (
        <>
        <Button onClick={onOpen} colorScheme="teal" >edit</Button>
    
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Modify Credit Terms for {props.entry.info.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Box>
                    <Input 
                        width="300px" 
                        onChange={(e) => setNewApr(parseFloat(e.target.value))} 
                        placeholder={"new apr: "+props.entry.info.terms.apr}
                    />
                    <Input 
                        width="300px" 
                        onChange={(e) => setNewCreditLimit(parseFloat(e.target.value))} 
                        placeholder={"new credit line size: "+props.entry.info.terms.creditlineSize}
                    />
                     <Input 
                        width="300px" 
                        onChange={(e) => setNewTenor(parseFloat(e.target.value))} 
                        placeholder={"new default tenor (in days): "+props.entry.info.terms.tenorInDays}
                    />
 
                    <Button onClick={update} width="150px">
                        Update
                    </Button>
                </Box>

            </ModalBody>
    
            <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
                </Button>
                <Button variant="ghost">Secondary Action</Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    )
}
 