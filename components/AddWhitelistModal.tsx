import {
    Box,
    Spinner,
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
import { ReceiverInfo, Terms } from "./Main";

interface Props {
    supplier: string
}

interface WhitelistInput {
    supplierId: string
    purchaser: ReceiverInfo
    tenorInDays: number
    apr: number
    creditlineSize: number
}
interface WhitelistUpdateInput {
    supplierId: string
    purchaserId: string
    tenorInDays: number
    apr: number
    creditlineSize: number
}


export const AddWhitelistModal = (props: {supplier}) => {
    const [searchString, setSearchString] = useState(null)
    const [searchResults, setSearchResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [receiver, setReceiver] = React.useState("")
    const [newApr, setNewApr] = useState(null)
    const [newCreditLimit, setNewCreditLimit] = useState(null)
    const [newTenor, setNewTenor] = useState(null)
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
    const submit = async () => {
        setLoading(true)
        // setSearchResults([])
        const receiverInfo = searchResults.filter((s) => s.id === receiver)[0]
        axiosInstance.post(
            "/v1/whitelist/new",
            {
                input: {
                    supplierId: props.supplier,
                    purchaser: {
                        id: receiverInfo.id,
                        name: receiverInfo.name,
                        phone: receiverInfo.phone,
                        city: receiverInfo.city,
                        terms: {
                            apr: newApr,
                            tenorInDays: newTenor,
                            creditlineSize: newCreditLimit
                        } as Terms
                    } as ReceiverInfo
                } as WhitelistInput
            })

        .then((result)=>{
            setLoading(false)
            console.log(result)
            if (result.status === 200) {
                toast({
                    title: "Success!",
                    description: "Receiver has been added to whitelist!",
                    status: "success",
                    duration: 4000,
                    isClosable: true,
                })
            }
            setReceiver("")
            setSearchResults([])
            onClose()
        })
        .catch((err) => {
            setLoading(false)
            toast({
                title: "Error!",
                description: err.response.data.detail || "Unknown Error",
                status: "error",
                duration: 5000,
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
                    onChange={setReceiver}
                    value={receiver}
                >
                    {searchResults  && searchResults.map((s) => (
                        <Box key={"option-" + s.id}>
                            <Stack direction="row">
                                <Radio value={s.id} > {s.name}({s.city}) {s.phone} </Radio>
                            </Stack>
                        </Box>
                        ) 
                    )}
                </RadioGroup>
                {receiver && (
                    <div>
                        <TermsBox 
                        terms={searchResults.filter(s => s.id === receiver)[0].terms} 
                        setNewApr={setNewApr}
                        setNewCreditLimit={setNewCreditLimit}
                        setNewTenor={setNewTenor} />
                    </div>
                )}
            </ModalBody>
    
            <ModalFooter>
                <Button colorScheme="gray" mr={3} onClick={onClose}>
                Back
                </Button>
                <Button colorScheme="teal" mr={3} onClick={submit} 
                disabled={!(receiver && newApr && newTenor && newCreditLimit)}
                >
                    {!loading ? "Submit" : <Spinner />}
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    )
}

const TermsBox = (props: {terms: Terms, setNewApr, setNewTenor, setNewCreditLimit}) => {
    return (
        <>
            <Box>
                <Input 
                    width="300px" 
                    onChange={(e) => props.setNewApr(parseFloat(e.target.value))} 
                    placeholder={"new apr: "+props.terms.apr}
                />
                <Input 
                    width="300px" 
                    onChange={(e) => props.setNewCreditLimit(parseFloat(e.target.value))} 
                    placeholder={"new credit line size: "+props.terms.creditlineSize}
                />
                    <Input 
                    width="300px" 
                    onChange={(e) => props.setNewTenor(parseFloat(e.target.value))} 
                    placeholder={"new default tenor (in days): "+props.terms.tenorInDays}
                />
                </Box>
            </>
    )
}

export const ModWhitelistModal = (props: {entry: CreditLineInfo, supplier: string}) => {
    const [newApr, setNewApr] = useState(null)
    const [newCreditLimit, setNewCreditLimit] = useState(null)
    const [newTenor, setNewTenor] = useState(null)
    const [loading, setLoading] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()


    const update = () => {
        setLoading(true)
        axiosInstance.post(
            "/v1/whitelist/update",
            {
                update: {
                    supplierId: props.supplier,
                    purchaserId: props.entry.info.id,
                    apr: newApr,
                    tenorInDays: newTenor,
                    creditlineSize: newCreditLimit
                } as WhitelistUpdateInput
        })
        .then((result)=>{
            setLoading(false)
            console.log(result)
            if (result.status === 200) {
                toast({
                    title: "Success!",
                    description: "Receiver has been modified!",
                    status: "success",
                    duration: 4000,
                    isClosable: true,
                })
            }
            onClose()
        })
        .catch((err) => {
            setLoading(false)
            toast({
                title: "Error!",
                description: err.response.data.detail || "Unknown Error",
                status: "error",
                duration: 5000,
                isClosable: true,
            })
        })
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
                <TermsBox terms={props.entry.info.terms} setNewApr={setNewApr} setNewCreditLimit={setNewCreditLimit} setNewTenor={setNewTenor} />
            </ModalBody>
    
            <ModalFooter>
                <Button colorScheme="gray" mr={3} onClick={onClose}>
                Back
                </Button>
                <Button colorScheme="teal" mr={3} onClick={update} 
                disabled={!(newApr || newTenor || newCreditLimit)}
                >
                    {!loading ? "Submit" : <Spinner />}
                </Button>
 
            </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    )
}
 