import { createStandaloneToast } from "@chakra-ui/react"

const toast = createStandaloneToast()

export const toastMessage = (title: string, status: "success" | "error" | "warning" | "info", message: string ) => {
    toast({
        title: title,
        description: message,
        status: status,
        duration: 4000,
        isClosable: true,
    })
}

export const error = toastMessage.bind(null, "Error!", "error")
export const success = toastMessage.bind(null, "Success!", "success")
