import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button
  } from '@chakra-ui/react'
//   import ReactJson from 'react-json-view'
//   import ReactJsonPrint from 'react-json-print/src/react-json-print';

  // TODO type data
  function SearchResultDetails(data) {
    //   console.log('searchdetails data', JSON.parse(data))
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
      <>
        <Button onClick={onOpen}>Details</Button>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Search Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <div>
                    {JSON.stringify(data)}
                </div>
                {/* <ReactJson src={JSON.parse(data)} /> */}
                {/* <ReactJsonPrint dataObject={JSON.parse(data)} /> */}
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }

export default SearchResultDetails