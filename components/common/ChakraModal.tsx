import {
  Button,
  Modal, ModalBody,
  ModalCloseButton,
  ModalContent, ModalFooter,
  ModalHeader,
  ModalOverlay, Spinner,
  useDisclosure
} from "@chakra-ui/react";
import React, {useEffect} from "react";


interface Props {
  buttonText: string
  heading: string
  body: React.ReactNode
  footer: React.ReactNode
  close: boolean
}


export const ChakraModal = ({buttonText, heading, body, footer, close}: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  useEffect(() => {
    if(close) {
      onClose()
    }
  }, [close])
      return (
        <>
        <Button onClick={onOpen} colorScheme="teal" >{buttonText}</Button>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>{heading}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>{body}</ModalBody>
            <ModalFooter>
              <Button colorScheme="gray" mr={3} onClick={onClose}>Back</Button>
              {footer}
            </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    )
}