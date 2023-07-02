import Head from 'next/head';
import {
  Avatar,
  Center,
  Container,
  Flex,
  Heading,
  Icon,
  Table,
  Text,
  Tbody,
  Tr,
  Td,
  Skeleton,
  SkeletonCircle,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  UnorderedList,
  Button,
  ListItem
} from '@chakra-ui/react';
import useSWR from 'swr';
import fetcher from '@/utils/fetcher';
import { BsQuestion } from 'react-icons/bs';

export default function Home() {
  const { data } = useSWR('/api/stats', fetcher);
  const { data: transactions } = useSWR('/api/transactions', fetcher);
  const { isOpen, onOpen, onClose } = useDisclosure();
  if (!data || !transactions) {
    return (
      <div>
        <Head>
          <title>2022</title>
        </Head>
        <Container
          width="100vw"
          maxWidth="100vw"
          minHeight="100vh"
          backgroundColor="white"
          p={0}
        >
          <Flex
            width="100%"
            justifyContent="center"
            alignItems="center"
            direction="column"
          >
            <Flex
              mt="20px"
              alignItems="center"
              justifyContent="space-between"
              width="100%"
              px={3}
            >
              <Heading color="black" fontSize="20px">
                Taškai
              </Heading>
              <Center
                w="32px"
                h="32px"
                backgroundColor="gray.100"
                color="gray.600"
                borderRadius="100%"
              >
                <Icon as={BsQuestion} />
              </Center>
            </Flex>
            <Table backgroundColor="white" mx={0} mt="20px">
              <Tbody fontWeight="500">
                <Tr backgroundColor="white" fontSize="sm">
                  <Td
                    color="black"
                    py={3}
                    pl={3}
                    pr={0}
                    borderTop="1px solid"
                    borderTopColor="gray.100"
                  >
                    <SkeletonCircle />
                  </Td>
                  <Td
                    color="black"
                    pr={3}
                    pl={0}
                    py={3}
                    borderTop="1px solid"
                    borderTopColor="gray.100"
                    fontWeight="700"
                  >
                    <Skeleton width="105px" height="16px" />
                    <Skeleton width="35px" height="13px" mt="4px" />
                  </Td>
                </Tr>
                <Tr backgroundColor="white" fontSize="sm">
                  <Td
                    color="black"
                    py={3}
                    pl={3}
                    pr={0}
                    borderTop="1px solid"
                    borderTopColor="gray.100"
                  >
                    <SkeletonCircle />
                  </Td>
                  <Td
                    color="black"
                    pr={3}
                    pl={0}
                    py={3}
                    borderTop="1px solid"
                    borderTopColor="gray.100"
                    fontWeight="700"
                  >
                    <Skeleton width="135px" height="16px" />
                    <Skeleton width="35px" height="13px" mt="4px" />
                  </Td>
                  <Td
                    color="black"
                    px={3}
                    py={3}
                    borderTop="1px solid"
                    borderTopColor="gray.100"
                    isNumeric
                  >
                    <Skeleton width="20px" height="16px" />
                  </Td>
                </Tr>
                <Tr backgroundColor="white" fontSize="sm">
                  <Td
                    color="black"
                    py={3}
                    pl={3}
                    pr={0}
                    borderTop="1px solid"
                    borderTopColor="gray.100"
                  >
                    <SkeletonCircle />
                  </Td>
                  <Td
                    color="black"
                    pr={3}
                    pl={0}
                    py={3}
                    borderTop="1px solid"
                    borderTopColor="gray.100"
                    fontWeight="700"
                  >
                    <Skeleton width="115px" height="16px" />
                    <Skeleton width="35px" height="13px" mt="4px" />
                  </Td>
                  <Td
                    color="black"
                    px={3}
                    py={3}
                    borderTop="1px solid"
                    borderTopColor="gray.100"
                    isNumeric
                  >
                    <Skeleton width="20px" height="16px" />
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </Flex>
        </Container>
      </div>
    );
  }
  return (
    <div>
      <Head>
        <title>2022</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container
        width="100vw"
        maxWidth="100vw"
        minHeight="100vh"
        backgroundColor="white"
        p={0}
      >
        <Flex
          width="100%"
          justifyContent="center"
          alignItems="center"
          direction="column"
        >
          <Flex
            mt="20px"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
            px={3}
          >
            <Heading color="black" fontSize="20px">
              Taškai
            </Heading>
            <Center
              w="32px"
              h="32px"
              backgroundColor="gray.100"
              color="gray.600"
              borderRadius="100%"
              onClick={onOpen}
            >
              <Icon as={BsQuestion} />
            </Center>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Taškų sistema</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <UnorderedList>
                    <ListItem>
                      Visi dalyviai pradeda su vienodu kiekiu taškų
                    </ListItem>
                    <ListItem>
                      Taškus galima gauti iš žaidimų arba užduočių (taškų
                      papildymai)
                    </ListItem>
                    <ListItem>
                      Taškus galima naudoti žaidžiant žaidimus vienam prieš
                      moderatorius arba žaidžiant dviese prieš kitą žaidėją
                      (tokiu atveju abiejų žaidėjų taškus gauna laimėtojas)
                    </ListItem>
                    <ListItem>
                      Užduotys skirtos taškų papildymui yra prieinamos tik
                      žaidėjui nebeturint taškų
                    </ListItem>
                    <ListItem>
                      Užduotimis skirtomis taškų papildymui piktnaudžiauti
                      negalima
                    </ListItem>
                    <ListItem>
                      Žaidimai vyksta iki pagrindinio žaidimo pradžios, o po jo
                      prasideda apdovanojimai
                    </ListItem>
                    <ListItem>
                      Visuose žaidimuose, išskyrus grupiniuose, yra &quot;House
                      Edge&quot;, t.y. kazino procentas, kuris skirtas išlaikyti
                      taškų vertę
                    </ListItem>
                    <ListItem>
                      Norint žaisti žaidimus vienam ar prieš kitą žaidėją,
                      kreipkitės į bet kurį moderatorių ir jis suorganizuos
                      žaidimo eigą ir vėliau išdalins taškus
                    </ListItem>
                    <ListItem>
                      Visi sukčiavimai ar bandymai pasipelnyti bus traktuojami
                      individualiai, atsižvelgiant į aplinkybes
                    </ListItem>
                    <ListItem>
                      Už asmeninio turto pralošimą žaidimų organizatoriai
                      neatsako
                    </ListItem>
                  </UnorderedList>
                </ModalBody>
                <ModalFooter>
                  <Button variant="ghost" onClick={onClose}>
                    Grįžti
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Flex>
          <Table backgroundColor="white" mx={0} mt="20px">
            <Tbody fontWeight="500">
              {data.results
                .sort((a, b) => b.id - a.id)
                .map((stat, i) => (
                  <Tr key={stat.name} backgroundColor="white" fontSize="sm">
                    <Td
                      color="black"
                      py={3}
                      pl={3}
                      pr={0}
                      borderTop="1px solid"
                      borderTopColor="gray.100"
                    >
                      <Avatar name={stat.name} src={`${stat.name}.png`} />
                    </Td>
                    <Td
                      color="black"
                      pr={3}
                      pl={0}
                      py={3}
                      borderTop="1px solid"
                      borderTopColor="gray.100"
                      fontWeight="700"
                    >
                      {stat.name}
                      <Text
                        color="gray.600"
                        fontSize="13px"
                        mt="4px"
                        fontWeight="400"
                      >
                        {/* {stat.total} */} Savo taškus galite sužinoti pas
                        moderatorių
                      </Text>
                    </Td>
                    <Td
                      isNumeric
                      color="black"
                      px={3}
                      py={3}
                      borderTop="1px solid"
                      borderTopColor="gray.100"
                      fontWeight="500"
                      fontSize="14px"
                    >
                      TOP{i < 5 ? '5' : i < 10 ? '10' : '20'}
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
          {/* {transactions.results.length !== 0 && (
            <Box my={3} px={3}>
              <Text mb={3} fontWeight="600">
                Paskutiniai pervedimai:
              </Text>
              {transactions.results.map((transaction) => {
                if (transaction.gameType === 'group')
                  return (
                    <Text key={transaction.id} fontSize="12px" mb={2}>
                      <Text color="green.600" display="inline">
                        {transaction.to}
                      </Text>{' '}
                      laimėjo{' '}
                      <Text color="green.600" display="inline">
                        {transaction.amount}
                      </Text>{' '}
                      taškų už{' '}
                      <Text color="green.600" display="inline">
                        {transaction.place}
                      </Text>{' '}
                      vietą žaidime{' '}
                      <Text color="green.600" display="inline">
                        {transaction.game}
                      </Text>
                      .
                    </Text>
                  );
                else if (transaction.gameType === 'solo')
                  return (
                    <Text key={transaction.id} fontSize="12px" mb={2}>
                      <Text
                        color={
                          transaction.from.length === 0
                            ? 'green.600'
                            : 'red.600'
                        }
                        display="inline"
                      >
                        {transaction.from.length === 0
                          ? transaction.to
                          : transaction.from}
                      </Text>{' '}
                      {transaction.from.length === 0 ? 'laimėjo' : 'pralaimėjo'}{' '}
                      <Text
                        color={
                          transaction.from.length === 0
                            ? 'green.600'
                            : 'red.600'
                        }
                        display="inline"
                      >
                        {transaction.from.length === 0
                          ? transaction.amountAfterHouseEdge
                          : transaction.amount}
                      </Text>{' '}
                      taškų žaidime{' '}
                      <Text
                        color={
                          transaction.from.length === 0
                            ? 'green.600'
                            : 'red.600'
                        }
                        display="inline"
                      >
                        {transaction.game}
                      </Text>
                      .
                    </Text>
                  );
                else if (transaction.gameType === '1v1')
                  return (
                    <Text key={transaction.id} fontSize="12px" mb={2}>
                      <Text color="green.600" display="inline">
                        {transaction.to}
                      </Text>{' '}
                      laimėjo{' '}
                      <Text color="green.600" display="inline">
                        {transaction.amountAfterHouseEdge}
                      </Text>{' '}
                      taškų žaidime{' '}
                      <Text color="green.600" display="inline">
                        {transaction.game}
                      </Text>{' '}
                      iš{' '}
                      <Text color="red.600" display="inline">
                        {transaction.from}
                      </Text>
                      .
                    </Text>
                  );
                else if (transaction.gameType === 'admin')
                  return (
                    <Text key={transaction.id} fontSize="12px" mb={2}>
                      <Text
                        color={
                          transaction.from.length === 0
                            ? 'green.600'
                            : 'red.600'
                        }
                        display="inline"
                      >
                        {transaction.from.length === 0
                          ? transaction.to
                          : transaction.from}
                      </Text>{' '}
                      {transaction.from.length === 0 ? 'gavo' : 'neteko'}{' '}
                      <Text
                        color={
                          transaction.from.length === 0
                            ? 'green.600'
                            : 'red.600'
                        }
                        display="inline"
                      >
                        {transaction.amount}
                      </Text>{' '}
                      taškų dėl{' '}
                      <Text
                        color={
                          transaction.from.length === 0
                            ? 'green.600'
                            : 'red.600'
                        }
                        display="inline"
                      >
                        {transaction.game}
                      </Text>
                      . (administratorius:{' '}
                      <Text fontWeight="500" display="inline">
                        {transaction.by}
                      </Text>
                      )
                    </Text>
                  );
              })}
            </Box>
          )} */}
        </Flex>
      </Container>
    </div>
  );
}
