import { createStandaloneToast } from "@chakra-ui/react"

const toast = createStandaloneToast()

export const toastMessage = (title: string, message: string) => {
    toast({
        title: title,
        description: message,
        status: "info",
        duration: 4000,
        isClosable: true,
    })
}

export const error = toastMessage.bind(null, "Error!")
export const success = toastMessage.bind(null, "Success!")
