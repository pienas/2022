import Head from 'next/head';
import cookie from 'js-cookie';
import firebase from '@/lib/firebase';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import {
  Link,
  Avatar,
  Box,
  Table,
  Text,
  Tbody,
  Tr,
  Td,
  Flex,
  Center,
  Icon,
  Heading,
  Skeleton,
  SkeletonCircle
} from '@chakra-ui/react';
import useSWR from 'swr';
import fetcher from '@/utils/fetcher';
import { BsGiftFill, BsQuestion } from 'react-icons/bs';

export default function Manage() {
  const authCookie = cookie.get('auth');
  const firestore = firebase.firestore();
  const router = useRouter();
  const { data } = useSWR('/api/stats', fetcher);
  const { data: transactions } = useSWR('/api/transactions', fetcher);
  if (typeof window !== 'undefined') {
    if (authCookie !== undefined) {
      const ref = firestore.collection('users').doc(authCookie);
      ref.get().then(async (doc) => {
        if (doc.exists) {
          if (!doc.data().admin) router.push('/');
        } else {
          router.push('/');
          cookie.remove('auth');
        }
      });
    } else {
      router.push('/');
    }
  }
  if (!data || !transactions) {
    return (
      <div>
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
      </div>
    );
  }
  return (
    <div>
      <Head>
        <title>Valdymas - 2022</title>
      </Head>
      <main>
        <NextLink href="/manage/transaction" passHref>
          <Link color="blue.500" fontWeight="medium">
            Pervesti taškus
          </Link>
        </NextLink>
        <br />
        <NextLink href="/manage/add" passHref>
          <Link color="teal.500" fontWeight="normal">
            Pridėti taškų
          </Link>
        </NextLink>
        <br />
        <NextLink href="/manage/remove" passHref>
          <Link color="teal.500" fontWeight="normal">
            Atimti taškų
          </Link>
        </NextLink>
        <br />
        <br />
        <NextLink href="/" passHref>
          <Link color="blue.500" fontWeight="medium">
            Grįžti į pradžią
          </Link>
        </NextLink>
        <br />
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
                      {stat.total}
                    </Text>
                  </Td>
                  <Td
                    isNumeric
                    color={
                      i === 0
                        ? 'yellow.500'
                        : i === 1
                        ? 'gray.500'
                        : i === 2
                        ? 'orange.700'
                        : 'black'
                    }
                    px={3}
                    py={3}
                    borderTop="1px solid"
                    borderTopColor="gray.100"
                    fontWeight={i < 3 ? '700' : '500'}
                    fontSize={
                      i === 0
                        ? '18px'
                        : i === 1
                        ? '16px'
                        : i === 2
                        ? '14px'
                        : '12px'
                    }
                  >
                    #{i + 1}
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
        {transactions.results.length !== 0 && (
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
                        transaction.from.length === 0 ? 'green.600' : 'red.600'
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
                        transaction.from.length === 0 ? 'green.600' : 'red.600'
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
                        transaction.from.length === 0 ? 'green.600' : 'red.600'
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
                        transaction.from.length === 0 ? 'green.600' : 'red.600'
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
                        transaction.from.length === 0 ? 'green.600' : 'red.600'
                      }
                      display="inline"
                    >
                      {transaction.amount}
                    </Text>{' '}
                    taškų dėl{' '}
                    <Text
                      color={
                        transaction.from.length === 0 ? 'green.600' : 'red.600'
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
        )}
      </main>
    </div>
  );
}
