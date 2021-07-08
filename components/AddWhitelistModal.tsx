import {
    Box,
    Input,
    HStack,
    Stack,
    Button,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    Radio, RadioGroup,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
} from "@chakra-ui/react"
import { CreditLineInfo} from "./CreditlinesTable"
import React, { useState } from "react";
import axiosInstance from "../utils/fetcher"

interface Props {
    supplier: string
}


export const AddWhitelistModal = (props: {supplier}) => {
    // const [newApr, setNewApr] = useState(null)
    // const [newCreditLimit, setNewCreditLimit] = useState(null)
    const [searchString, setSearchString] = useState(null)
    const [searchResults, setSearchResults] = useState([])
    const [receiver, setReceiver] = React.useState({})
    const [value, setValue] = React.useState(0)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

    const search = async () => {
        setSearchResults([])
        axiosInstance.post("/v1/whitelist/search/" +  searchString)
        .then((result)=>{
            console.log(result)

            if (result.data.status === "OK") {
                setSearchResults(result.data.results)
            }
            if (result.data.status === "too many matches") {
                toast({
                    title: "Error!",
                    description: "Too many matches!",
                    status: "info",
                    duration: 2000,
                    isClosable: true,
                })
            }
        })
        .catch((err) => {
            toast({
                title: "Error!",
                description: err.response.data.detail || "Unknown Error",
                status: "error",
                duration: 2000,
                isClosable: true,
            })
        })
    }



    return (
        <>
        <Button onClick={onOpen} colorScheme="teal" >Add New</Button>
    
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader> Add new whitelist entry for {props.supplier}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Box>
                    <Input 
                        width="300px" 
                        onChange={(e) => setSearchString(e.target.value)} 
                        placeholder={"phone number of name of receiver"}
                    />
                    <Button onClick={search} width="150px" disabled={!searchString}>
                        Search
                    </Button>
                </Box>

                <RadioGroup 
                // onChange={setValue}
                value={value}
                >
                    {/* // TODO this behaves super weird! */}
                    {searchResults  && searchResults.map((s, index) => (
                        <Box key={"option-" + s.id}>
                            <Stack direction="row">
                                <Radio 
                                value={index}
                                onChange={() => {setValue(index); setReceiver(s)}}
                                >
                                    {s.name}({s.city}) {s.phone}
                                </Radio>
                            </Stack>
                        </Box>
                        ) 
                    )}
                </RadioGroup>

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
 