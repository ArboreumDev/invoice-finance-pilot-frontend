import {Box, Button, Input, Radio, RadioGroup, Spinner, Stack} from "@chakra-ui/react";
import React, {useState} from "react";
import axiosInstance from "../../utils/fetcher";
import TermsBox from "./TermsBox";
import {error} from "./popups";

export const TuskerSearch = (props: {submit: (toast) => void, loading, searchResults: any,
  setSearchResults: React.Dispatch<React.SetStateAction<any>>, receiver: string,
  setReceiver: React.Dispatch<React.SetStateAction<any>>, newApr: number,
  setNewApr: React.Dispatch<React.SetStateAction<any>>, newCreditLimit: number,
  setNewCreditLimit: React.Dispatch<React.SetStateAction<any>>, newTenor: number,
  setNewTenor: React.Dispatch<React.SetStateAction<any>>}) => {
  const [searchString, setSearchString] = useState(null)
  const search = async () => {
    props.setSearchResults([])
    axiosInstance.post("/v1/whitelist/search/" +  searchString)
    .then((result)=>{
        if (result.data.status === "OK") {
            props.setSearchResults(result.data.results)
        }
        if (result.data.status === "too many matches") {
            error("Too many matches!")
        }
    })
    .catch((err) => {
        const message = err.response?.data?.detail || "Unknown Error"
        error(message)
    })
  }
  return (
    <Box mt={5}>
      <Box mb={3}>
        <Input
            width="300px"
            onChange={(e) => setSearchString(e.target.value)}
            placeholder={"phone number of name"}
        />
      </Box>
      <Box mt={3} mb={3}>
        <Button onClick={search} width="150px" disabled={!searchString}>
            Search
        </Button>
      </Box>
      {props.searchResults && (
        <Box mt={3} mb={5}>
          <RadioGroup
              onChange={props.setReceiver}
              value={props.receiver}
          >
              {props.searchResults  && props.searchResults.map((s) => (
                  <Box key={"option-" + s.id}>
                      <Stack direction="row">
                          <Radio value={s.id} > {s.name}({s.city}) {s.phone} </Radio>
                      </Stack>
                  </Box>
                  )
              )}
          </RadioGroup>
        </Box>
      )}
      {props.receiver && (
          <Box mb={3}>
              <TermsBox
              apr={props.newApr}
              setNewApr={props.setNewApr}
              creditLimit={props.newCreditLimit}
              setNewCreditLimit={props.setNewCreditLimit}
              tenor={props.newTenor}
              setNewTenor={props.setNewTenor} />
          </Box>
      )}
      <Box>
        <Button colorScheme="teal" mr={3} onClick={props.submit}
        disabled={!(props.receiver && props.newApr && props.newTenor && props.newCreditLimit)}
        >
            {!props.loading ? "Submit" : <Spinner />}
        </Button>
      </Box>
    </Box>
  )
}