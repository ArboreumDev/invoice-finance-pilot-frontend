import { ChakraProvider } from "@chakra-ui/react";
import AppBar from '../components/AppBar'
import Main from '../components/Main'

export default function Home() {
  return (
    <ChakraProvider>
      <AppBar />
      <Main />
    </ChakraProvider>
  )
}
